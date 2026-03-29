const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sriram@4", // put the password you set
  database: "barter_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
    
    // Create users table if it doesn't exist with name column
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createUsersTable, (err) => {
      if (err) {
        console.error("❌ Error creating users table:", err);
      } else {
        console.log("✅ Users table ready");
      }
    });
    
    // Create exchanges table if it doesn't exist
    const createExchangesTable = `
      CREATE TABLE IF NOT EXISTS exchanges (
        id INT PRIMARY KEY AUTO_INCREMENT,
        from_user_id INT NOT NULL,
        from_user_name VARCHAR(255),
        from_user_email VARCHAR(255),
        to_user_id INT NOT NULL,
        to_user_name VARCHAR(255),
        to_user_email VARCHAR(255),
        what_you_offering VARCHAR(500),
        what_you_need VARCHAR(500),
        exchange_date DATE NOT NULL,
        exchange_place VARCHAR(500) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
      )
    `;
    
    db.query(createExchangesTable, (err) => {
      if (err) {
        console.error("❌ Error creating exchanges table:", err);
      } else {
        console.log("✅ Exchanges table ready");
      }
    });
    
    // Create products table if it doesn't exist (for barter offers)
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        offer VARCHAR(500) NOT NULL,
        need VARCHAR(500) NOT NULL,
        image LONGTEXT,
        category VARCHAR(100),
        certificate VARCHAR(255),
        proof_photos LONGTEXT,
        insurance VARCHAR(255),
        registration VARCHAR(255),
        ownership VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    
    db.query(createProductsTable, (err) => {
      if (err) {
        console.error("❌ Error creating products table:", err);
      } else {
        console.log("✅ Products table ready");
      }
    });
    
    // Add missing columns to products table if they don't exist
    const addProductColumns = [
      `ALTER TABLE products ADD COLUMN certificate VARCHAR(255)`,
      `ALTER TABLE products ADD COLUMN proof_photos LONGTEXT`,
      `ALTER TABLE products ADD COLUMN insurance VARCHAR(255)`,
      `ALTER TABLE products ADD COLUMN registration VARCHAR(255)`,
      `ALTER TABLE products ADD COLUMN ownership VARCHAR(255)`
    ];
    
    addProductColumns.forEach((query, index) => {
      db.query(query, (err) => {
        if (err && err.code === 'ER_DUP_FIELDNAME') {
          // Column already exists, skip
        } else if (err) {
          // Other error
        } else {
          console.log(`✅ Column added to products table`);
        }
      });
    });
    
    // Add name column to users table if it doesn't exist (for existing databases)
    const addNameColumn = `
      ALTER TABLE users ADD COLUMN name VARCHAR(255)
    `;
    
    db.query(addNameColumn, (err) => {
      if (err && err.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ Name column already exists in users table");
      } else if (err) {
        console.error("⚠️ Note: name column already exists or error:", err.code);
      } else {
        console.log("✅ Name column added to users table");
      }
    });
  }
});

module.exports = db;
