-- Technical Test Results Table
-- Matches TechnicalTestResult entity

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

CREATE INDEX idx_candidate_email ON technical_test_results(candidate_email);
CREATE INDEX idx_test_date ON technical_test_results(test_date);
CREATE INDEX idx_passed ON technical_test_results(passed);
CREATE INDEX idx_submitted_at ON technical_test_results(submitted_at);
