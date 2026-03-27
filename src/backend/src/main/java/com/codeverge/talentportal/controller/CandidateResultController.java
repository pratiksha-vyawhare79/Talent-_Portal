package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.CandidateResult;
import com.codeverge.talentportal.service.CandidateResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate-results")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175"
})
public class CandidateResultController {
    
    @Autowired
    private CandidateResultService candidateResultService;
    
    @PostMapping("/save")
    public ResponseEntity<?> saveCandidateResult(@RequestBody CandidateResult result) {
        try {
            CandidateResult savedResult = candidateResultService.saveCandidateResult(result);
            return ResponseEntity.ok(Map.of(
                "message", "Candidate result saved successfully",
                "resultId", savedResult.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to save candidate result: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCandidateResultByEmail(@PathVariable String email) {
        try {
            return candidateResultService.getCandidateResultByEmail(email)
                    .map(result -> ResponseEntity.ok(result))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve candidate result: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/email/{email}/all")
    public ResponseEntity<?> getAllCandidateResultsByEmail(@PathVariable String email) {
        try {
            List<CandidateResult> results = candidateResultService.getAllCandidateResultsByEmail(email);
            return ResponseEntity.ok(Map.of(
                "message", "Candidate results retrieved successfully",
                "results", results,
                "count", results.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve candidate results: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllCandidateResults() {
        try {
            List<CandidateResult> results = candidateResultService.getAllResults();
            return ResponseEntity.ok(Map.of(
                "message", "All candidate results retrieved successfully",
                "results", results,
                "count", results.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve candidate results: " + e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidateResult(@PathVariable Long id) {
        try {
            boolean deleted = candidateResultService.deleteCandidateResultById(id);
            if (!deleted) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(Map.of(
                "message", "Candidate result deleted successfully",
                "resultId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to delete candidate result: " + e.getMessage())
            );
        }
    }
}
