package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/coding-results")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175"})
public class CodingResultsController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private EmailService emailService;
    
    // Get all coding results with user info
    @GetMapping("/all")
    public List<Map<String, Object>> getAllCodingResults() {
        try {
            // First check if table exists and count records
            String countSql = "SELECT COUNT(*) FROM codeverge_db.coding_results";
            Integer count = jdbcTemplate.queryForObject(countSql, Integer.class);
            System.out.println("🔍 DEBUG: Total records in coding_results: " + count);
            
            // Check what tables exist
            String tablesSql = "SHOW TABLES";
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(tablesSql);
            System.out.println("🔍 DEBUG: Available tables: " + tables);
            
            // Modified query without users join since users table doesn't exist - using students table
            String sql = """
                SELECT cr.*, 
                    s.email as user_email,
                    s.first_name,
                    s.last_name
                FROM codeverge_db.coding_results cr 
                LEFT JOIN codeverge_db.students s ON cr.user_id = s.id 
                ORDER BY cr.submitted_at DESC
                """;
            
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);
            System.out.println("🔍 DEBUG: Query results count: " + results.size());
            
            return results;
        } catch (Exception e) {
            System.out.println("❌ ERROR in getAllCodingResults: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // Temporary endpoint to insert test data (for testing only)
    @PostMapping("/insert-test-data")
    public Map<String, Object> insertTestData() {
        try {
            String sql = """
                INSERT INTO codeverge_db.coding_results (
                    user_id, question_id, question_text, user_code, language, time_taken_seconds, 
                    submitted_at, test_session_id, is_correct, score, feedback
                ) VALUES 
                (1, 1, 'Write a program to check if a number is prime', 'def is_prime(n):\\n    if n <= 1:\\n        return False\\n    for i in range(2, int(n**0.5) + 1):\\n        if n % i == 0:\\n            return False\\n    return True', 'python', 300, NOW(), 'session-001', true, 15.0, 'Good solution'),
                (2, 2, 'Write a program to sort an array', 'function sortArray(arr) {\\n    return arr.sort((a, b) => a - b);\\n}', 'javascript', 180, NOW(), 'session-002', true, 12.0, 'Needs improvement'),
                (3, 3, 'Write a program to find factorial', 'public class Factorial {\\n    public static int factorial(int n) {\\n        if (n <= 1) return 1;\\n        return n * factorial(n-1);\\n    }\\n}', 'java', 240, NOW(), 'session-003', false, 8.0, 'Incorrect logic')
                """;
            
            jdbcTemplate.update(sql);
            return Map.of("success", true, "message", "Test data inserted successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error inserting test data: " + e.getMessage());
        }
    }
    
    // Get coding result by ID with user info
    @GetMapping("/{id}")
    public Map<String, Object> getCodingResultById(@PathVariable Long id) {
        String sql = """
            SELECT cr.*, s.email as user_email, s.first_name, s.last_name 
            FROM codeverge_db.coding_results cr 
            LEFT JOIN codeverge_db.students s ON cr.user_id = s.id 
            WHERE cr.id = ?
            """;
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, id);
            System.out.println("🔍 DEBUG: getCodingResultById for ID " + id + ": " + result);
            return result;
        } catch (Exception e) {
            System.out.println("❌ ERROR in getCodingResultById: " + e.getMessage());
            return null;
        }
    }
    
    // Get coding results by user ID
    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getCodingResultsByUserId(@PathVariable Long userId) {
        String sql = """
            SELECT cr.*, u.email as user_email, u.first_name, u.last_name 
            FROM codeverge_db.coding_results cr 
            LEFT JOIN codeverge_db.users u ON cr.user_id = u.id 
            WHERE cr.user_id = ? 
            ORDER BY cr.submitted_at DESC
            """;
        try {
            return jdbcTemplate.queryForList(sql, userId);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    // Add review to coding result
    @PostMapping("/{id}/review")
    public Map<String, Object> addReview(@PathVariable Long id, @RequestBody Map<String, Object> reviewData) {
        String sql = """
            UPDATE codeverge_db.coding_results SET 
                admin_feedback = ?, 
                admin_rating = ?, 
                admin_reviewed_at = NOW(), 
                admin_reviewer_id = ? 
            WHERE id = ?
            """;
        try {
            System.out.println("🔍 DEBUG: addReview called for ID: " + id + " with data: " + reviewData);
            
            int rating = (Integer) reviewData.get("rating");
            String feedback = (String) reviewData.get("feedback");
            String reviewerId = (String) reviewData.get("reviewerId");
            
            System.out.println("🔍 DEBUG: Updating with admin_feedback='" + feedback + "', admin_rating=" + rating + ", admin_reviewer_id='" + reviewerId + "'");
            
            int updated = jdbcTemplate.update(sql, 
                feedback, 
                rating, 
                reviewerId, 
                id);
            
            System.out.println("🔍 DEBUG: Updated " + updated + " rows");
            
            if (updated > 0) {
                return Map.of("success", true, "message", "Review added successfully");
            } else {
                return Map.of("success", false, "message", "Failed to add review");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR in addReview: " + e.getMessage());
            return Map.of("success", false, "message", "Error adding review");
        }
    }
    
    // Update score and status
    @PostMapping("/{id}/score")
    public Map<String, Object> updateScore(@PathVariable Long id, @RequestBody Map<String, Object> scoreData) {
        System.out.println("🔍 DEBUG: updateScore called for ID: " + id + " with data: " + scoreData);
        String sql = "UPDATE codeverge_db.coding_results SET score = ?, is_correct = ? WHERE id = ?";
        try {
            int score = (Integer) scoreData.get("score");
            boolean isCorrect = score >= 10;
            System.out.println("🔍 DEBUG: Updating score to " + score + " and is_correct to " + isCorrect + " for ID " + id);
            int updated = jdbcTemplate.update(sql, score, isCorrect, id);
            System.out.println("🔍 DEBUG: Updated " + updated + " rows");
            
            if (updated > 0) {
                return Map.of("success", true, "message", "Score updated successfully");
            } else {
                return Map.of("success", false, "message", "Failed to update score");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR in updateScore: " + e.getMessage());
            return Map.of("success", false, "message", "Error updating score");
        }
    }
    
    // Delete coding result
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteCodingResult(@PathVariable Long id) {
        System.out.println("🔍 DEBUG: deleteCodingResult called for ID: " + id);
        String sql = "DELETE FROM codeverge_db.coding_results WHERE id = ?";
        try {
            System.out.println("🔍 DEBUG: Executing delete query for ID: " + id);
            int deleted = jdbcTemplate.update(sql, id);
            System.out.println("🔍 DEBUG: Deleted " + deleted + " rows from database");
            
            if (deleted > 0) {
                return Map.of("success", true, "message", "Coding result deleted successfully");
            } else {
                return Map.of("success", false, "message", "Failed to delete coding result");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR in deleteCodingResult: " + e.getMessage());
            return Map.of("success", false, "message", "Error deleting coding result");
        }
    }
    
    // Send email
    @PostMapping("/{id}/send-email")
    public Map<String, Object> sendEmail(@PathVariable Long id, @RequestBody Map<String, Object> emailData) {
        try {
            // Get user info and result details
            String getUserSql = """
                SELECT cr.*, s.email as user_email, s.first_name, s.last_name 
                FROM codeverge_db.coding_results cr 
                LEFT JOIN codeverge_db.students s ON cr.user_id = s.id 
                WHERE cr.id = ?
                """;
            Map<String, Object> result = jdbcTemplate.queryForMap(getUserSql, id);
            
            if (result != null) {
                String requestedEmail = emailData.get("to") != null ? emailData.get("to").toString().trim() : "";
                String storedEmail = result.get("user_email") != null ? result.get("user_email").toString().trim() : "";
                String userEmail = !requestedEmail.isEmpty() ? requestedEmail : storedEmail;
                String firstName = result.get("first_name") != null ? result.get("first_name").toString() : "";
                String lastName = result.get("last_name") != null ? result.get("last_name").toString() : "";
                String userName = (firstName + " " + lastName).trim();
                if (userName.isEmpty()) {
                    userName = "Candidate";
                }

                if (userEmail.isEmpty()) {
                    return Map.of("success", false, "message", "Recipient email is missing");
                }

                Integer score = ((Number) result.get("score")).intValue();
                boolean isPassed = score >= 10;
                String statusMessage = isPassed ? "PASS" : "FAIL";
                
                System.out.println("🔍 DEBUG: Sending email to: " + userEmail + " for user: " + userName + " with score: " + score + " (" + statusMessage + ")");
                
                boolean emailSent = isPassed
                        ? emailService.sendCodingTestPassEmailStyled(userEmail, userName)
                        : emailService.sendCodingTestFailEmailStyled(userEmail, userName);
                
                if (emailSent) {
                    return Map.of("success", true, "message", "Email sent successfully to " + userName + " (" + userEmail + "). Status: " + statusMessage);
                } else {
                    return Map.of("success", false, "message", "Failed to send email to " + userEmail);
                }
            } else {
                return Map.of("success", false, "message", "Result not found");
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR in sendEmail: " + e.getMessage());
            return Map.of("success", false, "message", "Error sending email: " + e.getMessage());
        }
    }
    
    // Get statistics
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        try {
            String totalSql = "SELECT COUNT(*) as total FROM codeverge_db.coding_results";
            String passedSql = "SELECT COUNT(*) as passed FROM codeverge_db.coding_results WHERE score >= 10";
            String avgSql = "SELECT AVG(score) as average FROM codeverge_db.coding_results";
            
            Long total = jdbcTemplate.queryForObject(totalSql, Long.class);
            Long passed = jdbcTemplate.queryForObject(passedSql, Long.class);
            Double average = jdbcTemplate.queryForObject(avgSql, Double.class);
            
            return Map.of(
                "totalResults", total != null ? total : 0L,
                "passedCount", passed != null ? passed : 0L,
                "failedCount", (total != null ? total : 0L) - (passed != null ? passed : 0L),
                "averageScore", average != null ? average : 0.0
            );
        } catch (Exception e) {
            System.err.println("Error fetching statistics: " + e.getMessage());
            return Map.of("error", "Failed to fetch statistics");
        }
    }
}
