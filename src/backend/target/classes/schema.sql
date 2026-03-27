CREATE TABLE IF NOT EXISTS coding_questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  difficulty_level VARCHAR(50) NOT NULL,
  programming_language VARCHAR(50) NOT NULL,
  time_limit_minutes INT NOT NULL,
  sample_input TEXT,
  expected_output TEXT,
  constraints TEXT,
  hints TEXT,
  solution_code TEXT,
  test_cases JSON,
  points INT NOT NULL,
  is_active TINYINT(1) NOT NULL,
  created_by VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
