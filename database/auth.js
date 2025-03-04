const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("./database")
const { body, validationResult } = require("express-validator")

dotenv.config()
const router = express.Router()

// SECRET KEY for JWT
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h"

// Password strength validation
const passwordStrength = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let strength = 0
  if (hasUpperCase) strength += 1
  if (hasLowerCase) strength += 1
  if (hasNumbers) strength += 1
  if (hasSpecialChars) strength += 1

  if (strength < 3) {
    return {
      valid: false,
      message:
        "Password is too weak. It should contain at least 3 of: uppercase, lowercase, numbers, and special characters",
    }
  }

  return { valid: true }
}

// Rate limiting for login attempts
const loginAttempts = {}

// Clear login attempts periodically
setInterval(
  () => {
    const now = Date.now()
    for (const ip in loginAttempts) {
      // Remove entries older than 1 hour
      if (now - loginAttempts[ip].timestamp > 60 * 60 * 1000) {
        delete loginAttempts[ip]
      }
    }
  },
  10 * 60 * 1000,
) // Clean up every 10 minutes

// Middleware to check login attempts
function checkLoginAttempts(req, res, next) {
  const ip = req.ip

  if (loginAttempts[ip]) {
    // If more than 5 failed attempts in the last hour
    if (loginAttempts[ip].attempts >= 5 && Date.now() - loginAttempts[ip].timestamp < 60 * 60 * 1000) {
      return res.status(429).json({
        message: "Too many login attempts, please try again later",
      })
    }
  }

  next()
}

// User Registration with validation
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters")
      .isAlphanumeric()
      .withMessage("Username must contain only letters and numbers")
      .trim(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        })
      }

      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" })
      }

      // Custom password validation
      const passwordCheck = passwordStrength(password)
      if (!passwordCheck.valid) {
        return res.status(400).json({ message: passwordCheck.message })
      }

      // Check if user already exists
      db.get("SELECT id FROM users WHERE username = ?", [username], (err, existingUser) => {
        if (err) {
          console.error("Database error:", err.message)
          return res.status(500).json({ message: "Server error", error: err.message })
        }

        if (existingUser) {
          return res.status(409).json({ message: "Username already exists" })
        }

        // Hash the password
        bcrypt.hash(password, 12, (err, hashedPassword) => {
          if (err) {
            console.error("Hashing error:", err.message)
            return res.status(500).json({ message: "Error hashing password" })
          }

          // Insert user into database
          db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
            if (err) {
              console.error("Database insertion error:", err.message)
              return res.status(500).json({ message: "Error registering user", error: err.message })
            }

            // Create initial login timestamp
            const userId = this.lastID
            db.run(
              "INSERT INTO user_activity (user_id, last_login, created_at) VALUES (?, ?, ?)",
              [userId, null, new Date().toISOString()],
              (err) => {
                if (err) {
                  console.error("Error recording user activity:", err.message)
                  // Continue despite error - non-critical operation
                }
              },
            )

            res.status(201).json({
              message: "User registered successfully",
              userId: userId,
            })
          })
        })
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
)

// User Login with rate limiting
router.post("/login", checkLoginAttempts, (req, res) => {
  const { username, password } = req.body
  const ip = req.ip

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  // Fetch user from database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Database query error:", err.message)
      return res.status(500).json({ message: "Server error", error: err.message })
    }

    // Track login attempt
    if (!loginAttempts[ip]) {
      loginAttempts[ip] = { attempts: 1, timestamp: Date.now() }
    } else {
      loginAttempts[ip].attempts += 1
      loginAttempts[ip].timestamp = Date.now()
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Password comparison error:", err.message)
        return res.status(500).json({ message: "Server error", error: err.message })
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" })
      }

      // Reset login attempts on successful login
      delete loginAttempts[ip]

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY })

      // Update last login timestamp
      db.run(
        "UPDATE user_activity SET last_login = ? WHERE user_id = ?",
        [new Date().toISOString(), user.id],
        (err) => {
          if (err) {
            console.error("Error updating login time:", err.message)
            // Continue despite error - non-critical operation
          }
        },
      )

      res.json({
        message: "Login successful",
        token,
        expiresIn: TOKEN_EXPIRY,
        userId: user.id,
      })
    })
  })
})

// Password Reset Request
router.post("/reset-password-request", (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ message: "Username is required" })
  }

  // Check if user exists
  db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Database query error:", err.message)
      return res.status(500).json({ message: "Server error", error: err.message })
    }

    if (!user) {
      // For security, don't reveal if user exists or not
      return res.json({ message: "If your account exists, a reset link will be sent" })
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id, purpose: "password_reset" }, SECRET_KEY, { expiresIn: "15m" })

    // Store reset token with expiry - in a real app, this would trigger an email
    // For demo, just return the token directly
    res.json({
      message: "Password reset link generated",
      resetToken,
      // NOTE: In a real app, you would NOT send the token back directly
      // Instead you would email a link with the token embedded
      resetLink: `${req.protocol}://${req.get("host")}/reset-password?token=${resetToken}`,
    })
  })
})

// Password Reset Completion
router.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" })
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    // Validate purpose of token
    if (decoded.purpose !== "password_reset") {
      return res.status(401).json({ message: "Invalid token purpose" })
    }

    // Check password strength
    const passwordCheck = passwordStrength(newPassword)
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message })
    }

    // Hash new password
    bcrypt.hash(newPassword, 12, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" })
      }

      // Update password in database
      db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, decoded.userId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating password", error: err.message })
        }

        res.json({ message: "Password reset successful" })
      })
    })
  })
})

// Validates a token (for client-side validation)
router.post("/validate-token", (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ message: "Token is required" })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    res.json({ valid: true, userId: decoded.userId, username: decoded.username })
  } catch (error) {
    res.json({ valid: false, message: "Invalid or expired token" })
  }
})

// Initialize user activity table
db.run(
  `
  CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    last_login TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating user_activity table:", err.message)
    } else {
      console.log("User activity table created or already exists.")
    }
  },
)

module.exports = router

