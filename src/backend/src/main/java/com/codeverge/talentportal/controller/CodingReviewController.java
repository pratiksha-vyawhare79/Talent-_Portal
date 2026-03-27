package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.service.CodingReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coding-review")
@CrossOrigin(origins = "*")
public class CodingReviewController {
    
    @Autowired
    private CodingReviewService codingReviewService;
    
    // Get all pending coding test submissions for admin review
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingSubmissions() {
        List<Map<String, Object>> pendingSubmissions = codingReviewService.getPendingSubmissions();
        return ResponseEntity.ok(pendingSubmissions);
    }
    
    // Get all coding test submissions (with filters)
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllSubmissions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dateRange) {
        List<Map<String, Object>> submissions = codingReviewService.getAllSubmissions(status, dateRange);
        return ResponseEntity.ok(submissions);
    }
    
    // Get detailed coding test submission for review
    @GetMapping("/submission/{testSessionId}")
    public ResponseEntity<Map<String, Object>> getSubmissionDetails(@PathVariable String testSessionId) {
        Map<String, Object> submissionDetails = codingReviewService.getSubmissionDetails(testSessionId);
        return ResponseEntity.ok(submissionDetails);
    }
    
    // Update admin rating and feedback for a specific question
    @PostMapping("/question/{resultId}/review")
    public ResponseEntity<String> reviewQuestion(
            @PathVariable Long resultId,
            @RequestBody Map<String, Object> reviewData) {
        try {
            codingReviewService.reviewQuestion(resultId, reviewData);
            return ResponseEntity.ok("Question review saved successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving review: " + e.getMessage());
        }
    }
    
    // Update overall test status and rating
    @PostMapping("/submission/{testSessionId}/status")
    public ResponseEntity<String> updateSubmissionStatus(
            @PathVariable String testSessionId,
            @RequestBody Map<String, Object> statusData) {
        try {
            codingReviewService.updateSubmissionStatus(testSessionId, statusData);
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating status: " + e.getMessage());
        }
    }
    
    // Send qualification email to candidate
    @PostMapping("/submission/{testSessionId}/send-qualification-email")
    public ResponseEntity<String> sendQualificationEmail(@PathVariable String testSessionId) {
        try {
            codingReviewService.sendQualificationEmail(testSessionId);
            return ResponseEntity.ok("Qualification email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }
    
    // Send rejection email to candidate
    @PostMapping("/submission/{testSessionId}/send-rejection-email")
    public ResponseEntity<String> sendRejectionEmail(@PathVariable String testSessionId) {
        try {
            codingReviewService.sendRejectionEmail(testSessionId);
            return ResponseEntity.ok("Rejection email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }
    
    // Get review statistics for admin dashboard
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getReviewStatistics() {
        Map<String, Object> statistics = codingReviewService.getReviewStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    // Get admin review history
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getReviewHistory(
            @RequestParam(required = false) String dateRange) {
        List<Map<String, Object>> history = codingReviewService.getReviewHistory(dateRange);
        return ResponseEntity.ok(history);
    }
    
    // Bulk update multiple submissions
    @PostMapping("/bulk-update")
    public ResponseEntity<String> bulkUpdateSubmissions(@RequestBody Map<String, Object> bulkData) {
        try {
            codingReviewService.bulkUpdateSubmissions(bulkData);
            return ResponseEntity.ok("Bulk update completed successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error in bulk update: " + e.getMessage());
        }
    }
    
    // Get email templates
    @GetMapping("/email-templates")
    public ResponseEntity<List<Map<String, Object>>> getEmailTemplates() {
        List<Map<String, Object>> templates = codingReviewService.getEmailTemplates();
        return ResponseEntity.ok(templates);
    }
    
    // Update email template
    @PostMapping("/email-template/{templateId}")
    public ResponseEntity<String> updateEmailTemplate(
            @PathVariable Long templateId,
            @RequestBody Map<String, Object> templateData) {
        try {
            codingReviewService.updateEmailTemplate(templateId, templateData);
            return ResponseEntity.ok("Email template updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating template: " + e.getMessage());
        }
    }
}
