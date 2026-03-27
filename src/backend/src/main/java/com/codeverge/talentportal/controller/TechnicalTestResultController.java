package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.model.TechnicalTestResult;
import com.codeverge.talentportal.service.TechnicalTestResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/technical-test-results")
@CrossOrigin(origins = "*")
public class TechnicalTestResultController {
    private static final Logger log = LoggerFactory.getLogger(TechnicalTestResultController.class);
    
    @Autowired
    private TechnicalTestResultService technicalTestResultService;
    
    /**
     * Save technical test result
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveTestResult(@RequestBody Map<String, Object> resultData, 
                                        HttpServletRequest request) {
        try {
            log.info("Received technical test result save request with keys: {}", resultData.keySet());
            TechnicalTestResult savedResult = technicalTestResultService.saveTestResultWithMetadata(resultData, request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Technical test result saved successfully",
                "resultId", savedResult.getId(),
                "passed", savedResult.getPassed(),
                "percentage", savedResult.getPercentageScore()
            ));
        } catch (Exception e) {
            log.error("Failed to save technical test result", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to save technical test result: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get all results for a candidate
     */
    @GetMapping("/candidate/{email}")
    public ResponseEntity<?> getResultsByCandidate(@PathVariable String email) {
        try {
            List<TechnicalTestResult> results = technicalTestResultService.getResultsByCandidate(email);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get candidate results: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get latest result for a candidate
     */
    @GetMapping("/candidate/{email}/latest")
    public ResponseEntity<?> getLatestResultByCandidate(@PathVariable String email) {
        try {
            Optional<TechnicalTestResult> result = technicalTestResultService.getLatestResultByCandidate(email);
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get latest result: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get all technical test results
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllResults() {
        try {
            List<TechnicalTestResult> results = technicalTestResultService.getAllResults();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get all results: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get results by pass status
     */
    @GetMapping("/status/{passed}")
    public ResponseEntity<?> getResultsByStatus(@PathVariable Boolean passed) {
        try {
            List<TechnicalTestResult> results = technicalTestResultService.getResultsByPassStatus(passed);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get results by status: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get candidate statistics
     */
    @GetMapping("/candidate/{email}/statistics")
    public ResponseEntity<?> getCandidateStatistics(@PathVariable String email) {
        try {
            Object[] statistics = technicalTestResultService.getCandidateStatistics(email);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "statistics", statistics
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get candidate statistics: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get overall statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getOverallStatistics() {
        try {
            Object[] statistics = technicalTestResultService.getOverallStatistics();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "statistics", statistics
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get overall statistics: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Get result by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getResultById(@PathVariable Long id) {
        try {
            Optional<TechnicalTestResult> result = technicalTestResultService.findById(id);
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get result: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Delete technical test result by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTechnicalTestResult(@PathVariable Long id) {
        try {
            log.info("Attempting to delete technical test result with ID: {}", id);
            
            Optional<TechnicalTestResult> result = technicalTestResultService.findById(id);
            if (result.isPresent()) {
                technicalTestResultService.deleteTechnicalTestResult(id);
                log.info("Successfully deleted technical test result with ID: {}", id);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Technical test result deleted successfully",
                    "deletedId", id,
                    "deletedCandidateName", result.get().getCandidateName()
                ));
            } else {
                log.warn("Technical test result not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Failed to delete technical test result with ID: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to delete technical test result: " + e.getMessage()
            ));
        }
    }
}
