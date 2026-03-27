-- Technical Questions Table Setup for Codeverge Talent Portal
-- Run this in MySQL Workbench on your codeverge_db database

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS technical_questions;

-- Create technical_questions table
CREATE TABLE technical_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    optiona VARCHAR(500) NOT NULL,
    optionb VARCHAR(500) NOT NULL,
    optionc VARCHAR(500) NOT NULL,
    optiond VARCHAR(500) NOT NULL,
    correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
    category ENUM('java', 'python', 'javascript', 'react', 'nodejs', 'sql', 'html', 'css', 'general') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_at (created_at)
);

-- Questions will be added dynamically through admin panel
-- Verify table creation
SELECT * FROM technical_questions ORDER BY created_at DESC LIMIT 5;
