-- Debug Technical Test Results Issues
-- Run these queries to check the database state

-- 1. Check if table exists and has data
SELECT COUNT(*) as total_records FROM technical_test_results;

-- 2. Check table structure
DESCRIBE technical_test_results;

-- 3. Show all records (if any)
SELECT 
    id,
    candidate_email,
    candidate_name,
    total_questions,
    total_correct,
    percentage_score,
    passed,
    test_date,
    time_taken_seconds,
    submitted_at
FROM technical_test_results 
ORDER BY submitted_at DESC;

-- 4. Test inserting a simple record
INSERT INTO technical_test_results (
    candidate_email, 
    candidate_name, 
    test_date, 
    total_questions, 
    total_correct, 
    total_answered, 
    percentage_score, 
    time_taken_seconds, 
    passed, 
    submitted_at
) VALUES (
    'test@example.com', 
    'Test User', 
    NOW(), 
    20, 
    10, 
    20, 
    50.00, 
    1800, 
    TRUE, 
    NOW()
);

-- 5. Verify the test record was inserted
SELECT * FROM technical_test_results WHERE candidate_email = 'test@example.com';

-- 6. Clean up test record (optional)
-- DELETE FROM technical_test_results WHERE candidate_email = 'test@example.com';
