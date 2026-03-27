-- Create Admin Table for Codeverge Talent Portal
-- Run this script in MySQL Workbench on your codeverge_db database

CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email)
);

-- Insert default admin user (password: Admin@123)
-- The password is encrypted with BCrypt
INSERT IGNORE INTO admins (email, password) 
VALUES ('admincodeverge@gmail.com', '$2a$10$YourEncryptedPasswordHere');

-- Note: The encrypted password above is a placeholder.
-- The actual encrypted password will be created when the backend starts
-- and runs the DataInitializer, or you can update it manually.
