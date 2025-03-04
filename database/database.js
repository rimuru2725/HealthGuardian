const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (creates a file named healthguardian.db)
const db = new sqlite3.Database("./database/healthguardian.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON", (err) => {
  if (err) {
    console.error("Error enabling foreign keys:", err.message);
  } else {
    console.log("Foreign keys enabled.");
  }
});

// Create users table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
  )`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table created or already exists.");
    }
  }
);

// Create medical_records table with enhanced fields
db.run(
  `CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    full_name TEXT,
    dob TEXT,
    blood_group TEXT,
    allergies TEXT,
    chronic_diseases TEXT,
    emergency_contact TEXT,
    previous_diagnoses TEXT,
    prescriptions TEXT,
    medical_reports TEXT,
    vaccination_records TEXT,
    current_medications TEXT,
    upcoming_appointments TEXT,
    hospitalization_history TEXT,
    health_tracking_notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating medical_records table:", err.message);
    } else {
      console.log("Medical records table created or already exists.");
    }
  }
);

// Create vital_signs table for tracking health metrics
db.run(
  `CREATE TABLE IF NOT EXISTS vital_signs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    blood_pressure TEXT,
    heart_rate INTEGER,
    temperature REAL,
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    blood_glucose REAL,
    weight REAL,
    height REAL,
    bmi REAL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating vital_signs table:", err.message);
    } else {
      console.log("Vital signs table created or already exists.");
    }
  }
);

// Create medications_log table for detailed medication tracking
db.run(
  `CREATE TABLE IF NOT EXISTS medications_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    start_date TEXT,
    end_date TEXT,
    prescribing_doctor TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating medications_log table:", err.message);
    } else {
      console.log("Medications log table created or already exists.");
    }
  }
);

// Create appointments table for tracking medical appointments
db.run(
  `CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    doctor_name TEXT,
    facility TEXT,
    purpose TEXT,
    notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating appointments table:", err.message);
    } else {
      console.log("Appointments table created or already exists.");
    }
  }
);

// Create shared_records table for record sharing functionality
db.run(
  `CREATE TABLE IF NOT EXISTS shared_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    share_token TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    readonly INTEGER DEFAULT 1,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating shared_records table:", err.message);
    } else {
      console.log("Shared records table created or already exists.");
    }
  }
);

// Create activity_logs table for user activity tracking
db.run(
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating activity_logs table:", err.message);
    } else {
      console.log("Activity logs table created or already exists.");
    }
  }
);

// Create user_activity table for tracking login history
db.run(
  `CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    last_login TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating user_activity table:", err.message);
    } else {
      console.log("User activity table created or already exists.");
    }
  }
);

// Create emergency_contacts table
db.run(
  `CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    is_primary INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating emergency_contacts table:", err.message);
    } else {
      console.log("Emergency contacts table created or already exists.");
    }
  }
);

// Create document_attachments table for additional files
db.run(
  `CREATE TABLE IF NOT EXISTS document_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    description TEXT,
    upload_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating document_attachments table:", err.message);
    } else {
      console.log("Document attachments table created or already exists.");
    }
  }
);

// Create health_metrics table for tracking custom health metrics
db.run(
  `CREATE TABLE IF NOT EXISTS health_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating health_metrics table:", err.message);
    } else {
      console.log("Health metrics table created or already exists.");
    }
  }
);

// Create indexes for better query performance
db.serialize(() => {
  // Index on user_id in medical_records for faster user-specific queries
  db.run("CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id)");
  
  // Index on record_id in vital_signs for faster record-specific queries
  db.run("CREATE INDEX IF NOT EXISTS idx_vital_signs_record_id ON vital_signs(record_id)");
  
  // Index on record_id in medications_log
  db.run("CREATE INDEX IF NOT EXISTS idx_medications_log_record_id ON medications_log(record_id)");
  
  // Index on record_id in appointments
  db.run("CREATE INDEX IF NOT EXISTS idx_appointments_record_id ON appointments(record_id)");
  
  // Index on record_id in shared_records
  db.run("CREATE INDEX IF NOT EXISTS idx_shared_records_record_id ON shared_records(record_id)");
  
  // Index on user_id in activity_logs
  db.run("CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)");
  
  // Index on user_id in user_activity
  db.run("CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)");
});

// Helper function to run a query with parameters
db.queryAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run a single-row query
db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to run an insert/update/delete query
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

// Process to handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = db;