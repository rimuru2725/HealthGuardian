const express = require("express")
const jwt = require("jsonwebtoken")
const db = require("./database")
const dotenv = require("dotenv")
dotenv.config()
const router = express.Router()
const SECRET_KEY = process.env.JWT_SECRET
const CryptoJS = require("crypto-js")
const SECRET_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const PDFDocument = require("pdfkit")

// Ensure uploads directory exists
const uploadDir = "./uploads/"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // Create a more secure filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileExt = path.extname(file.originalname)
    cb(null, "medical-report-" + uniqueSuffix + fileExt)
  },
})

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf", "image/gif"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only images (PNG, JPEG, GIF) and PDFs are allowed"), false)
  }
}

// Set up multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

// Middleware to verify JWT Token
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.header("Authorization")
    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No token provided" })
    }

    const token = authHeader.split(" ")[1] // Extract token from header
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Invalid token format" })
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.error("Token verification error:", err.message)
        return res.status(403).json({ message: "Invalid or expired token" })
      }
      req.user = user

      // Log activity
      logUserActivity(req.user.userId, req.method, req.originalUrl)

      next()
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(500).json({ message: "Server error during authentication" })
  }
}

// Log user activity
function logUserActivity(userId, method, endpoint) {
  const timestamp = new Date().toISOString()

  db.run(
    `INSERT INTO activity_logs (user_id, action, endpoint, timestamp) 
    VALUES (?, ?, ?, ?)`,
    [userId, method, endpoint, timestamp],
    (err) => {
      if (err) {
        console.error("Error logging user activity:", err.message)
        // Non-critical error, continue execution
      }
    },
  )
}

// Helper function to safely decrypt data
function safeDecrypt(encryptedText, key) {
  if (!encryptedText) return ""
  try {
    return CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption error:", error)
    return "[Decryption Error]"
  }
}

// Helper function to safely encrypt data
function safeEncrypt(text, key) {
  if (!text) return CryptoJS.AES.encrypt("", key).toString()
  return CryptoJS.AES.encrypt(text, key).toString()
}

// 📌 1️⃣ Get Medical Records (Protected Route)
router.get("/", authenticateToken, (req, res) => {
  try {
    // Process search and filter parameters
    const searchTerm = req.query.search || ""
    const filterType = req.query.filter || ""

    let query = "SELECT * FROM medical_records WHERE user_id = ?"
    const queryParams = [req.user.userId]

    if (searchTerm) {
      // Add search conditions - we'll decrypt in memory after fetching
      query += " ORDER BY id DESC"
    } else if (filterType) {
      // Apply filters - we'll filter in memory after fetching and decrypting
      query += " ORDER BY id DESC"
    } else {
      query += " ORDER BY id DESC"
    }

    db.all(query, queryParams, (err, records) => {
      if (err) {
        console.error("Database error:", err.message)
        return res.status(500).json({ message: "Error retrieving records", error: err.message })
      }

      if (!records || records.length === 0) {
        return res.json([]) // Return empty array if no records
      }

      // Decrypt all records
      const decryptedRecords = records.map((record) => {
        try {
          return {
            id: record.id,
            full_name: safeDecrypt(record.full_name, SECRET_ENCRYPTION_KEY),
            dob: safeDecrypt(record.dob, SECRET_ENCRYPTION_KEY),
            blood_group: safeDecrypt(record.blood_group, SECRET_ENCRYPTION_KEY),
            allergies: safeDecrypt(record.allergies, SECRET_ENCRYPTION_KEY),
            chronic_diseases: safeDecrypt(record.chronic_diseases, SECRET_ENCRYPTION_KEY),
            emergency_contact: safeDecrypt(record.emergency_contact, SECRET_ENCRYPTION_KEY),
            previous_diagnoses: safeDecrypt(record.previous_diagnoses, SECRET_ENCRYPTION_KEY),
            prescriptions: safeDecrypt(record.prescriptions, SECRET_ENCRYPTION_KEY),
            medical_reports: record.medical_reports, // File path remains unchanged
            vaccination_records: safeDecrypt(record.vaccination_records, SECRET_ENCRYPTION_KEY),
            current_medications: safeDecrypt(record.current_medications, SECRET_ENCRYPTION_KEY),
            upcoming_appointments: safeDecrypt(record.upcoming_appointments, SECRET_ENCRYPTION_KEY),
            hospitalization_history: safeDecrypt(record.hospitalization_history, SECRET_ENCRYPTION_KEY),
            health_tracking_notes: safeDecrypt(record.health_tracking_notes, SECRET_ENCRYPTION_KEY),
          }
        } catch (error) {
          console.error("Error processing record:", error)
          return {
            id: record.id,
            error: "Error processing this record",
          }
        }
      })

      // Apply search filtering in memory after decryption
      let filteredRecords = decryptedRecords

      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        filteredRecords = decryptedRecords.filter((record) => {
          return (
            (record.full_name && record.full_name.toLowerCase().includes(search)) ||
            (record.blood_group && record.blood_group.toLowerCase().includes(search)) ||
            (record.allergies && record.allergies.toLowerCase().includes(search)) ||
            (record.chronic_diseases && record.chronic_diseases.toLowerCase().includes(search)) ||
            (record.current_medications && record.current_medications.toLowerCase().includes(search)) ||
            (record.previous_diagnoses && record.previous_diagnoses.toLowerCase().includes(search))
          )
        })
      }

      // Apply type filtering
      if (filterType) {
        switch (filterType) {
          case "allergies":
            filteredRecords = filteredRecords.filter((r) => r.allergies && r.allergies.trim() !== "")
            break
          case "medications":
            filteredRecords = filteredRecords.filter(
              (r) => r.current_medications && r.current_medications.trim() !== "",
            )
            break
          case "chronic":
            filteredRecords = filteredRecords.filter((r) => r.chronic_diseases && r.chronic_diseases.trim() !== "")
            break
          case "appointments":
            filteredRecords = filteredRecords.filter(
              (r) => r.upcoming_appointments && r.upcoming_appointments.trim() !== "",
            )
            break
          // Add more filter types as needed
        }
      }

      res.json(filteredRecords)
    })
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get a single medical record by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const recordId = req.params.id

    db.get("SELECT * FROM medical_records WHERE id = ? AND user_id = ?", [recordId, req.user.userId], (err, record) => {
      if (err) {
        console.error("Database error:", err.message)
        return res.status(500).json({ message: "Error retrieving record", error: err.message })
      }

      if (!record) {
        return res.status(404).json({ message: "Record not found" })
      }

      try {
        const decryptedRecord = {
          id: record.id,
          full_name: safeDecrypt(record.full_name, SECRET_ENCRYPTION_KEY),
          dob: safeDecrypt(record.dob, SECRET_ENCRYPTION_KEY),
          blood_group: safeDecrypt(record.blood_group, SECRET_ENCRYPTION_KEY),
          allergies: safeDecrypt(record.allergies, SECRET_ENCRYPTION_KEY),
          chronic_diseases: safeDecrypt(record.chronic_diseases, SECRET_ENCRYPTION_KEY),
          emergency_contact: safeDecrypt(record.emergency_contact, SECRET_ENCRYPTION_KEY),
          previous_diagnoses: safeDecrypt(record.previous_diagnoses, SECRET_ENCRYPTION_KEY),
          prescriptions: safeDecrypt(record.prescriptions, SECRET_ENCRYPTION_KEY),
          medical_reports: record.medical_reports, // File path remains unchanged
          vaccination_records: safeDecrypt(record.vaccination_records, SECRET_ENCRYPTION_KEY),
          current_medications: safeDecrypt(record.current_medications, SECRET_ENCRYPTION_KEY),
          upcoming_appointments: safeDecrypt(record.upcoming_appointments, SECRET_ENCRYPTION_KEY),
          hospitalization_history: safeDecrypt(record.hospitalization_history, SECRET_ENCRYPTION_KEY),
          health_tracking_notes: safeDecrypt(record.health_tracking_notes, SECRET_ENCRYPTION_KEY),
        }

        res.json(decryptedRecord)
      } catch (error) {
        console.error("Error decrypting record:", error)
        res.status(500).json({ message: "Error processing record", error: error.message })
      }
    })
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// 📌 2️⃣ Add a New Medical Record
router.post("/", authenticateToken, upload.single("medical_report"), (req, res) => {
  try {
    const {
      full_name,
      dob,
      blood_group,
      allergies = "",
      chronic_diseases = "",
      emergency_contact = "",
      previous_diagnoses = "",
      prescriptions = "",
      vaccination_records = "",
      current_medications = "",
      upcoming_appointments = "",
      hospitalization_history = "",
      health_tracking_notes = "",
    } = req.body

    if (!full_name || !dob || !blood_group) {
      return res.status(400).json({ message: "Full name, date of birth, and blood group are required" })
    }

    const medicalReportPath = req.file ? req.file.path : null // Store file path

    db.run(
      `INSERT INTO medical_records 
        (user_id, full_name, dob, blood_group, allergies, chronic_diseases, emergency_contact, 
         previous_diagnoses, prescriptions, medical_reports, vaccination_records, current_medications, 
         upcoming_appointments, hospitalization_history, health_tracking_notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        safeEncrypt(full_name, SECRET_ENCRYPTION_KEY),
        safeEncrypt(dob, SECRET_ENCRYPTION_KEY),
        safeEncrypt(blood_group, SECRET_ENCRYPTION_KEY),
        safeEncrypt(allergies, SECRET_ENCRYPTION_KEY),
        safeEncrypt(chronic_diseases, SECRET_ENCRYPTION_KEY),
        safeEncrypt(emergency_contact, SECRET_ENCRYPTION_KEY),
        safeEncrypt(previous_diagnoses, SECRET_ENCRYPTION_KEY),
        safeEncrypt(prescriptions, SECRET_ENCRYPTION_KEY),
        medicalReportPath, // File path remains unchanged
        safeEncrypt(vaccination_records, SECRET_ENCRYPTION_KEY),
        safeEncrypt(current_medications, SECRET_ENCRYPTION_KEY),
        safeEncrypt(upcoming_appointments, SECRET_ENCRYPTION_KEY),
        safeEncrypt(hospitalization_history, SECRET_ENCRYPTION_KEY),
        safeEncrypt(health_tracking_notes, SECRET_ENCRYPTION_KEY),
      ],
      function (err) {
        if (err) {
          console.error("Database insertion error:", err.message)
          return res.status(500).json({ message: "Error adding record", error: err.message })
        }
        res.status(201).json({ message: "Medical record added successfully", recordId: this.lastID })
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// 📌 3️⃣ Update a Medical Record
router.put("/:id", authenticateToken, upload.single("medical_report"), (req, res) => {
  try {
    const recordId = req.params.id

    // First check if the record exists and belongs to the user
    db.get(
      "SELECT id, medical_reports FROM medical_records WHERE id = ? AND user_id = ?",
      [recordId, req.user.userId],
      (err, record) => {
        if (err) {
          console.error("Database query error:", err.message)
          return res.status(500).json({ message: "Error checking record", error: err.message })
        }

        if (!record) {
          return res.status(404).json({ message: "Record not found or unauthorized" })
        }

        // Record exists and belongs to user, proceed with update
        const {
          full_name,
          dob,
          blood_group,
          allergies = "",
          chronic_diseases = "",
          emergency_contact = "",
          previous_diagnoses = "",
          prescriptions = "",
          vaccination_records = "",
          current_medications = "",
          upcoming_appointments = "",
          hospitalization_history = "",
          health_tracking_notes = "",
        } = req.body

        // Get the current medical report path if not uploading a new one
        let medicalReportPath = record.medical_reports

        // If a new file is uploaded, delete the old one
        if (req.file) {
          medicalReportPath = req.file.path

          // Delete old file if it exists
          if (record.medical_reports) {
            try {
              fs.unlinkSync(record.medical_reports)
            } catch (fileErr) {
              console.error("File deletion error:", fileErr)
              // Continue with update even if file deletion fails
            }
          }
        }

        db.run(
          `UPDATE medical_records 
           SET full_name = ?, dob = ?, blood_group = ?, allergies = ?, chronic_diseases = ?, emergency_contact = ?, 
               previous_diagnoses = ?, prescriptions = ?, medical_reports = ?, vaccination_records = ?, 
               current_medications = ?, upcoming_appointments = ?, hospitalization_history = ?, health_tracking_notes = ?
           WHERE id = ? AND user_id = ?`,
          [
            safeEncrypt(full_name, SECRET_ENCRYPTION_KEY),
            safeEncrypt(dob, SECRET_ENCRYPTION_KEY),
            safeEncrypt(blood_group, SECRET_ENCRYPTION_KEY),
            safeEncrypt(allergies, SECRET_ENCRYPTION_KEY),
            safeEncrypt(chronic_diseases, SECRET_ENCRYPTION_KEY),
            safeEncrypt(emergency_contact, SECRET_ENCRYPTION_KEY),
            safeEncrypt(previous_diagnoses, SECRET_ENCRYPTION_KEY),
            safeEncrypt(prescriptions, SECRET_ENCRYPTION_KEY),
            medicalReportPath,
            safeEncrypt(vaccination_records, SECRET_ENCRYPTION_KEY),
            safeEncrypt(current_medications, SECRET_ENCRYPTION_KEY),
            safeEncrypt(upcoming_appointments, SECRET_ENCRYPTION_KEY),
            safeEncrypt(hospitalization_history, SECRET_ENCRYPTION_KEY),
            safeEncrypt(health_tracking_notes, SECRET_ENCRYPTION_KEY),
            recordId,
            req.user.userId,
          ],
          (err) => {
            if (err) {
              console.error("Database update error:", err.message)
              return res.status(500).json({ message: "Error updating record", error: err.message })
            }
            res.json({ message: "Medical record updated successfully" })
          },
        )
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// 📌 4️⃣ Delete a Medical Record
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const recordId = req.params.id

    // First get the record to check if there's a file to delete
    db.get(
      "SELECT medical_reports FROM medical_records WHERE id = ? AND user_id = ?",
      [recordId, req.user.userId],
      (err, record) => {
        if (err) {
          console.error("Database query error:", err.message)
          return res.status(500).json({ message: "Error checking record", error: err.message })
        }

        if (!record) {
          return res.status(404).json({ message: "Record not found or unauthorized" })
        }

        // Delete the file if it exists
        if (record.medical_reports) {
          try {
            fs.unlinkSync(record.medical_reports)
          } catch (fileErr) {
            console.error("File deletion error:", fileErr)
            // Continue with record deletion even if file deletion fails
          }
        }

        // Delete the record from database
        db.run("DELETE FROM medical_records WHERE id = ? AND user_id = ?", [recordId, req.user.userId], (err) => {
          if (err) {
            console.error("Database deletion error:", err.message)
            return res.status(500).json({ message: "Error deleting record", error: err.message })
          }
          res.json({ message: "Medical record deleted successfully" })
        })
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Export Medical Record to PDF
router.get("/:id/export", authenticateToken, (req, res) => {
  try {
    const recordId = req.params.id

    // Get the record
    db.get("SELECT * FROM medical_records WHERE id = ? AND user_id = ?", [recordId, req.user.userId], (err, record) => {
      if (err) {
        console.error("Database query error:", err.message)
        return res.status(500).json({ message: "Error retrieving record", error: err.message })
      }

      if (!record) {
        return res.status(404).json({ message: "Record not found or unauthorized" })
      }

      try {
        // Decrypt record data
        const decryptedRecord = {
          full_name: safeDecrypt(record.full_name, SECRET_ENCRYPTION_KEY),
          dob: safeDecrypt(record.dob, SECRET_ENCRYPTION_KEY),
          blood_group: safeDecrypt(record.blood_group, SECRET_ENCRYPTION_KEY),
          allergies: safeDecrypt(record.allergies, SECRET_ENCRYPTION_KEY),
          chronic_diseases: safeDecrypt(record.chronic_diseases, SECRET_ENCRYPTION_KEY),
          emergency_contact: safeDecrypt(record.emergency_contact, SECRET_ENCRYPTION_KEY),
          previous_diagnoses: safeDecrypt(record.previous_diagnoses, SECRET_ENCRYPTION_KEY),
          prescriptions: safeDecrypt(record.prescriptions, SECRET_ENCRYPTION_KEY),
          medical_reports: record.medical_reports,
          vaccination_records: safeDecrypt(record.vaccination_records, SECRET_ENCRYPTION_KEY),
          current_medications: safeDecrypt(record.current_medications, SECRET_ENCRYPTION_KEY),
          upcoming_appointments: safeDecrypt(record.upcoming_appointments, SECRET_ENCRYPTION_KEY),
          hospitalization_history: safeDecrypt(record.hospitalization_history, SECRET_ENCRYPTION_KEY),
          health_tracking_notes: safeDecrypt(record.health_tracking_notes, SECRET_ENCRYPTION_KEY),
        }

        // Create PDF document
        const doc = new PDFDocument()

        // Set response headers
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=medical_record_${decryptedRecord.full_name.replace(/\s+/g, "_")}.pdf`,
        )

        // Pipe the PDF to the response
        doc.pipe(res)

        // Add content to PDF
        doc.fontSize(25).text("Medical Record", { align: "center" })
        doc.moveDown()

        // Patient information
        doc.fontSize(16).text("Patient Information")
        doc.moveDown(0.5)
        doc.fontSize(12).text(`Full Name: ${decryptedRecord.full_name}`)
        doc.text(`Date of Birth: ${new Date(decryptedRecord.dob).toLocaleDateString()}`)
        doc.text(`Blood Group: ${decryptedRecord.blood_group}`)
        if (decryptedRecord.emergency_contact) {
          doc.text(`Emergency Contact: ${decryptedRecord.emergency_contact}`)
        }
        doc.moveDown()

        // Medical information
        doc.fontSize(16).text("Medical Information")
        doc.moveDown(0.5)

        if (decryptedRecord.allergies && decryptedRecord.allergies.trim() !== "") {
          doc.fontSize(14).text("Allergies:")
          doc.fontSize(12).text(decryptedRecord.allergies)
          doc.moveDown()
        }

        if (decryptedRecord.chronic_diseases && decryptedRecord.chronic_diseases.trim() !== "") {
          doc.fontSize(14).text("Chronic Diseases:")
          doc.fontSize(12).text(decryptedRecord.chronic_diseases)
          doc.moveDown()
        }

        if (decryptedRecord.current_medications && decryptedRecord.current_medications.trim() !== "") {
          doc.fontSize(14).text("Current Medications:")
          doc.fontSize(12).text(decryptedRecord.current_medications)
          doc.moveDown()
        }

        if (decryptedRecord.prescriptions && decryptedRecord.prescriptions.trim() !== "") {
          doc.fontSize(14).text("Prescriptions:")
          doc.fontSize(12).text(decryptedRecord.prescriptions)
          doc.moveDown()
        }

        if (decryptedRecord.previous_diagnoses && decryptedRecord.previous_diagnoses.trim() !== "") {
          doc.fontSize(14).text("Previous Diagnoses:")
          doc.fontSize(12).text(decryptedRecord.previous_diagnoses)
          doc.moveDown()
        }

        if (decryptedRecord.hospitalization_history && decryptedRecord.hospitalization_history.trim() !== "") {
          doc.fontSize(14).text("Hospitalization History:")
          doc.fontSize(12).text(decryptedRecord.hospitalization_history)
          doc.moveDown()
        }

        if (decryptedRecord.vaccination_records && decryptedRecord.vaccination_records.trim() !== "") {
          doc.fontSize(14).text("Vaccination Records:")
          doc.fontSize(12).text(decryptedRecord.vaccination_records)
          doc.moveDown()
        }

        if (decryptedRecord.upcoming_appointments && decryptedRecord.upcoming_appointments.trim() !== "") {
          doc.fontSize(14).text("Upcoming Appointments:")
          doc.fontSize(12).text(decryptedRecord.upcoming_appointments)
          doc.moveDown()
        }

        // Notes section
        if (decryptedRecord.health_tracking_notes && decryptedRecord.health_tracking_notes.trim() !== "") {
          doc.fontSize(16).text("Health Notes:")
          doc.moveDown(0.5)
          doc.fontSize(12).text(decryptedRecord.health_tracking_notes)
        }

        // Add generation timestamp
        doc.moveDown(2)
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" })

        // Finalize the PDF and end the stream
        doc.end()
      } catch (error) {
        console.error("Error generating PDF:", error)
        res.status(500).json({ message: "Error generating PDF export", error: error.message })
      }
    })
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Share medical record with someone else
router.post("/:id/share", authenticateToken, (req, res) => {
  try {
    const recordId = req.params.id
    const { email, expireDays, readonly } = req.body

    if (!email) {
      return res.status(400).json({ message: "Recipient email is required" })
    }

    // Validate record ownership
    db.get(
      "SELECT id FROM medical_records WHERE id = ? AND user_id = ?",
      [recordId, req.user.userId],
      (err, record) => {
        if (err) {
          console.error("Database query error:", err.message)
          return res.status(500).json({ message: "Error checking record", error: err.message })
        }

        if (!record) {
          return res.status(404).json({ message: "Record not found or unauthorized" })
        }

        // Generate a secure share token
        const expireMillis = expireDays && expireDays !== "0" ? Number.parseInt(expireDays) * 24 * 60 * 60 * 1000 : null

        const expiresAt = expireMillis ? new Date(Date.now() + expireMillis).toISOString() : null

        const shareToken = jwt.sign(
          {
            recordId: record.id,
            userId: req.user.userId,
            shareType: "medical_record",
            readonly: readonly === true || readonly === "true",
          },
          SECRET_KEY,
          { expiresIn: expireDays ? `${expireDays}d` : "365d" },
        )

        // Create a share record in the database
        db.run(
          `INSERT INTO shared_records (record_id, user_id, share_token, recipient_email, expires_at, readonly) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [recordId, req.user.userId, shareToken, email, expiresAt, readonly ? 1 : 0],
          function (err) {
            if (err) {
              console.error("Database insertion error:", err.message)
              return res.status(500).json({ message: "Error creating share record", error: err.message })
            }

            // In a real application, you would send an email here
            // For this demo, we'll just return the share URL
            const shareUrl = `${req.protocol}://${req.get("host")}/shared-record?token=${shareToken}`

            res.status(201).json({
              message: "Record shared successfully",
              shareId: this.lastID,
              shareToken,
              shareUrl,
              // NOTE: In a real app, you would NOT send the token/URL back directly
              // Instead you would email the link to the recipient
              expiresAt,
            })
          },
        )
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get a list of who has access to a particular record
router.get("/:id/shares", authenticateToken, (req, res) => {
  try {
    const recordId = req.params.id

    // Check record ownership
    db.get(
      "SELECT id FROM medical_records WHERE id = ? AND user_id = ?",
      [recordId, req.user.userId],
      (err, record) => {
        if (err) {
          return res.status(500).json({ message: "Error checking record", error: err.message })
        }

        if (!record) {
          return res.status(404).json({ message: "Record not found or unauthorized" })
        }

        // Get all active shares
        db.all(
          `SELECT id, recipient_email, created_at, expires_at, readonly
           FROM shared_records 
           WHERE record_id = ? AND user_id = ? 
           ORDER BY created_at DESC`,
          [recordId, req.user.userId],
          (err, shares) => {
            if (err) {
              return res.status(500).json({ message: "Error retrieving shares", error: err.message })
            }

            res.json(shares)
          },
        )
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Revoke a share
router.delete("/shares/:shareId", authenticateToken, (req, res) => {
  try {
    const shareId = req.params.shareId

    // Verify ownership of the share
    db.get(
      `SELECT s.id, s.record_id, s.user_id 
       FROM shared_records s 
       WHERE s.id = ? AND s.user_id = ?`,
      [shareId, req.user.userId],
      (err, share) => {
        if (err) {
          return res.status(500).json({ message: "Error checking share", error: err.message })
        }

        if (!share) {
          return res.status(404).json({ message: "Share not found or unauthorized" })
        }

        // Delete the share
        db.run("DELETE FROM shared_records WHERE id = ?", [shareId], (err) => {
          if (err) {
            return res.status(500).json({ message: "Error revoking share", error: err.message })
          }

          res.json({ message: "Share revoked successfully" })
        })
      },
    )
  } catch (error) {
    console.error("Route error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Activity logs table
db.run(
  `
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating activity_logs table:", err.message)
    } else {
      console.log("Activity logs table created or already exists.")
    }
  },
)

// Shared records table
db.run(
  `
  CREATE TABLE IF NOT EXISTS shared_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    share_token TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    readonly INTEGER DEFAULT 1,
    FOREIGN KEY (record_id) REFERENCES medical_records(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating shared_records table:", err.message)
    } else {
      console.log("Shared records table created or already exists.")
    }
  },
)

module.exports = router

