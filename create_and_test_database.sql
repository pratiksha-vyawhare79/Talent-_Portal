-- Create database and table for technical test results
-- Run this in SQL Workbench to ensure database exists

-- 1. Create database if not exists
CREATE DATABASE IF NOT EXISTS codeverge_db;

-- 2. Use the database
USE codeverge_db;

-- 3. Drop table if exists (to recreate with correct structure)
DROP TABLE IF EXISTS technical_test_results;

-- 4. Create technical_test_results table
CREATE TABLE technical_test_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_questions INT NOT NULL DEFAULT 0,
    total_correct INT NOT NULL DEFAULT 0,
    total_answered INT NOT NULL DEFAULT 0,
    percentage_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    time_taken_seconds INT NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    section_data TEXT,
    technical_section_score INT DEFAULT 0,
    technical_section_total INT DEFAULT 0,
    technical_section_percentage DECIMAL(5,2) DEFAULT 0.00,
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for better performance
CREATE INDEX idx_candidate_email ON technical_test_results(candidate_email);
CREATE INDEX idx_test_date ON technical_test_results(test_date);
CREATE INDEX idx_passed ON technical_test_results(passed);
CREATE INDEX idx_submitted_at ON technical_test_results(submitted_at);

-- 6. Test insert a sample record
INSERT INTO technical_test_results (
    candidate_email, 
    candidate_name, 
    total_questions, 
    total_correct, 
    total_answered, 
    percentage_score, 
    time_taken_seconds, 
    passed, 
    submitted_at
) VALUES (
    'test@verification.com', 
    'Database Test', 
    20, 
    15, 
    20, 
    75.00, 
    1800, 
    TRUE, 
    NOW()
);

-- 7. Verify the record was inserted
SELECT * FROM technical_test_results WHERE candidate_email = 'test@verification.com';

-- 8. Show table structure
DESCRIBE technical_test_results;

-- 9. Clean up test record (optional)
-- DELETE FROM technical_test_results WHERE candidate_email = 'test@verification.com';
