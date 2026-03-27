-- Check if technical_questions table exists
SHOW TABLES LIKE 'technical_questions';

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS technical_questions (
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

-- Insert sample data if table is empty
INSERT IGNORE INTO technical_questions (question, optiona, optionb, optionc, optiond, correct_answer, category, difficulty) VALUES
('What is the purpose of the "static" keyword in Java?', 'It makes a method thread-safe', 'It belongs to the class rather than instances', 'It prevents inheritance', 'It makes variables immutable', 'b', 'java', 'medium'),
('Which of the following is NOT a valid JavaScript data type?', 'Number', 'Boolean', 'Float', 'String', 'c', 'javascript', 'easy'),
('What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language', 'a', 'sql', 'easy'),
('Which HTML tag is used to create a hyperlink?', '<link>', '<a>', '<href>', '<url>', 'b', 'html', 'easy'),
('What is the purpose of CSS in web development?', 'To add interactivity', 'To style web pages', 'To create databases', 'To handle server requests', 'b', 'css', 'easy'),
('Which Python library is commonly used for data manipulation?', 'Django', 'NumPy', 'Flask', 'Requests', 'b', 'python', 'medium'),
('What is a React Hook?', 'A way to connect React to external systems', 'A function that allows using state and other React features', 'A component lifecycle method', 'A routing mechanism', 'b', 'react', 'medium'),
('Which Node.js module is used for handling file operations?', 'http', 'fs', 'path', 'url', 'b', 'nodejs', 'medium');

-- Show the data
SELECT COUNT(*) as total_questions FROM technical_questions;
SELECT * FROM technical_questions ORDER BY created_at DESC LIMIT 5;
