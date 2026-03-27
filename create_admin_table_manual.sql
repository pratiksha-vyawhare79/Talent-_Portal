-- =====================================================
-- CREATE ADMIN TABLE FOR CODEVERGE TALENT PORTAL
-- =====================================================
-- Copy and paste this entire script into MySQL Workbench
-- Make sure you're connected to the codeverge_db database

-- First, let's check if the database exists
USE codeverge_db;

-- Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Insert the default admin user
-- Email: admincodeverge@gmail.com
-- Password: Admin@123 (BCrypt encrypted)
INSERT IGNORE INTO admins (email, password) 
VALUES ('admincodeverge@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Show the result
SELECT * FROM admins;

-- You should see one record with id=1 and email=admincodeverge@gmail.com
