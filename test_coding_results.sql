-- Insert sample coding test results for testing admin page
INSERT INTO codeverge_db.coding_results (
    user_id, question_id, question_text, user_code, language, time_taken_seconds, 
    submitted_at, test_session_id, is_correct, score, feedback
) VALUES 
-- Test Result 1
(1, 1, 'Write a program to check if a number is prime', 'def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True', 'python', 300, NOW(), 'session-001', true, 15.0, 'Good solution'),
-- Test Result 2  
(2, 2, 'Write a program to sort an array', 'function sortArray(arr) {\n    return arr.sort((a, b) => a - b);\n}', 'javascript', 180, NOW(), 'session-002', true, 12.0, 'Needs improvement'),
-- Test Result 3
(3, 3, 'Write a program to find factorial', 'public class Factorial {\n    public static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n-1);\n    }\n}', 'java', 240, NOW(), 'session-003', false, 8.0, 'Incorrect logic');
