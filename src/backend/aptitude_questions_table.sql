-- Aptitude Questions Table Setup for Codeverge Talent Portal
-- Run this in MySQL Workbench on your codeverge_db database

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS aptitude_questions;

-- Create aptitude_questions table
CREATE TABLE aptitude_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
    category ENUM('numerical', 'verbal', 'reasoning') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_at (created_at)
);

-- Insert sample questions (optional - for testing)
INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('A sum becomes Rs. 8,100 in 2 years at 12.5% p.a. simple interest. Principal is:', 'Rs. 7,000', 'Rs. 7,200', 'Rs. 7,500', 'Rs. 7,800', 'a', 'numerical', 'medium'),
('Two trains of lengths 120m and 180m run opposite at 54 km/h and 36 km/h. Time to cross each other:', '10 sec', '12 sec', '14 sec', '16 sec', 'a', 'numerical', 'medium'),
('If 3x - 2y = 7 and 2x + y = 8, value of x is:', '2', '3', '4', '5', '1', 'numerical', 'medium'),
('A can finish a work in 12 days, B in 18 days. Working together they finish in:', '6.8 days', '7.2 days', '7.5 days', '8 days', '1', 'numerical', 'medium'),
('If CP of 20 items = SP of 16 items, profit percent is:', '20%', '22.5%', '25%', '30%', '2', 'numerical', 'medium'),
('The average of 8 numbers is 24. If one number 32 is replaced by 48, new average is:', '25', '26', '27', '28', '1', 'numerical', 'medium'),
('A boat covers 30 km downstream in 2 hours and upstream in 3 hours. Speed of stream is:', '2.5 km/h', '3 km/h', '3.5 km/h', '4 km/h', '0', 'numerical', 'medium'),
('If sin(theta)=3/5 and theta is acute, then tan(theta)=', '3/4', '4/3', '5/4', '4/5', '0', 'numerical', 'hard');

-- Verify the insertion
SELECT * FROM aptitude_questions ORDER BY created_at DESC;
