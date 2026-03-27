-- Insert test data for coding results
-- First, ensure users table exists
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT IGNORE INTO users (email, first_name, last_name) VALUES
('john.doe@example.com', 'John', 'Doe'),
('jane.smith@example.com', 'Jane', 'Smith'),
('bob.wilson@example.com', 'Bob', 'Wilson');

-- Insert test coding results
INSERT INTO coding_results (
    user_id,
    name,
    question_id,
    question_text,
    user_code,
    language,
    time_taken_seconds,
    submitted_at,
    test_session_id,
    is_correct,
    score,
    feedback
) VALUES
(1, 'John Doe', 6, 'Write a program that checks whether a given number is a prime number.', 'def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprint(is_prime(17))', 'python', 120, NOW(), 'test-session-001', 1, 15.0, 'Good solution, well optimized'),
(2, 'Jane Smith', 6, 'Write a program that checks whether a given number is a prime number.', 'function isPrime(n) {\n    if (n <= 1) return false;\n    for (let i = 2; i <= Math.sqrt(n); i++) {\n        if (n % i === 0) return false;\n    }\n    return true;\n}\n\nconsole.log(isPrime(23));', 'javascript', 95, NOW(), 'test-session-002', 1, 18.0, 'Excellent code, handles edge cases well'),
(3, 'Bob Wilson', 6, 'Write a program that checks whether a given number is a prime number.', 'public class PrimeCheck {\n    public static boolean isPrime(int n) {\n        if (n <= 1) return false;\n        for (int i = 2; i <= Math.sqrt(n); i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPrime(29));\n    }\n}', 'java', 150, NOW(), 'test-session-003', 1, 12.0, 'Correct logic, could be more efficient'),
(1, 'John Doe', 6, 'Write a program that checks whether a given number is a prime number.', 'def is_prime(n):\n    if n <= 1:\n        return False\n    if n == 2:\n        return True\n    if n % 2 == 0:\n        return False\n    for i in range(3, int(n**0.5) + 1, 2):\n        if n % i == 0:\n            return False\n    return True', 'python', 110, DATE_SUB(NOW(), INTERVAL 1 DAY), 'test-session-004', 1, 20.0, 'Perfect solution with optimization for even numbers');

-- Verify the data was inserted
SELECT COUNT(*) as total_coding_results FROM coding_results;