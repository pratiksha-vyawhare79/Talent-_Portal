-- Add name column to coding_results table
-- Run this SQL script to add the name column to the existing coding_results table

USE codeverge_db;

-- Add the name column
ALTER TABLE coding_results
ADD COLUMN name VARCHAR(255) DEFAULT NULL AFTER user_id;

-- Update existing records with a default name based on user_id
-- Since we don't have a users table, we'll use a placeholder
UPDATE coding_results
SET name = CONCAT('Candidate_', user_id)
WHERE name IS NULL;

-- Verify the changes
SELECT id, user_id, name, question_id, submitted_at
FROM coding_results
LIMIT 10;

-- Show the updated table structure
DESCRIBE coding_results;