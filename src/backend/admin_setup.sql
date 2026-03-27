-- Admin Table Setup for Codeverge Talent Portal
-- Run this in MySQL Workbench on your codeverge_db database

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS admins;

-- Create admins table
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email)
);

-- Insert default admin with BCrypt encrypted password
-- Password: Admin@123
-- BCrypt hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO admins (email, password) 
VALUES ('admincodeverge@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Verify the insertion
SELECT * FROM admins;
