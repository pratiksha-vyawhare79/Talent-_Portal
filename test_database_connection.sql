-- =====================================================
-- TEST DATABASE CONNECTION AND CREATE ADMIN TABLE
-- =====================================================
-- Run this in MySQL Workbench step by step

-- Step 1: Check if you're connected to the right database
SELECT DATABASE() as current_database;

-- Step 2: List all existing tables
SHOW TABLES;

-- Step 3: Create the admins table manually
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Step 4: Insert the admin user
INSERT INTO admins (email, password) 
VALUES ('admincodeverge@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE email=email;

-- Step 5: Verify the admin was created
SELECT * FROM admins;

-- Step 6: List all tables again to confirm
SHOW TABLES;
