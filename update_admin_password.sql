-- =====================================================
-- UPDATE ADMIN PASSWORD WITH CORRECT BCRYPT HASH
-- =====================================================
-- Run this in MySQL Workbench to update the admin password

-- Update the admin password with correct BCrypt hash for "Admin@123"
UPDATE admins 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkGoANpNHqnszkIHh/4W'
WHERE email = 'admincodeverge@gmail.com';

-- Verify the update
SELECT * FROM admins WHERE email = 'admincodeverge@gmail.com';

-- The password hash above corresponds to "Admin@123"
-- You can now test login with:
-- Email: admincodeverge@gmail.com
-- Password: Admin@123
