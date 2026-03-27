-- Create coding_results table to store coding test submissions
CREATE TABLE IF NOT EXISTS coding_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    question_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    user_code LONGTEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    time_taken_seconds INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    test_session_id VARCHAR(100) NOT NULL,
    is_correct BOOLEAN DEFAULT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES coding_questions(id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_test_session_id (test_session_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_user_session (user_id, test_session_id)
);

-- Create a summary table for overall test performance
CREATE TABLE IF NOT EXISTS coding_test_summary (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    test_session_id VARCHAR(100) NOT NULL UNIQUE,
    total_questions INT NOT NULL,
    questions_attempted INT NOT NULL,
    total_score DECIMAL(5,2) DEFAULT 0,
    total_time_taken_seconds INT NOT NULL,
    average_score_percent DECIMAL(5,2) DEFAULT 0,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'SUBMITTED') DEFAULT 'SUBMITTED',
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_test_session_id (test_session_id),
    INDEX idx_status (status),
    INDEX idx_completed_at (completed_at)
);

-- Add comments for better documentation
ALTER TABLE coding_results COMMENT = 'Stores individual coding question answers and results';
ALTER TABLE coding_test_summary COMMENT = 'Stores overall coding test performance summary for each user session';
