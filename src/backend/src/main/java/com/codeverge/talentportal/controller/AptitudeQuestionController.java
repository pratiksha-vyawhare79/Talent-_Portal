package com.codeverge.talentportal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeverge.talentportal.entity.AptitudeQuestion;
import com.codeverge.talentportal.service.AptitudeQuestionService;

@RestController
@RequestMapping("/api/aptitude-questions")
@CrossOrigin(origins = "*")
public class AptitudeQuestionController {
    
    @Autowired
    private AptitudeQuestionService aptitudeQuestionService;
    
    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        try {
            List<AptitudeQuestion> questions = aptitudeQuestionService.getAllQuestions();
            return ResponseEntity.ok(Map.of(
                "message", "Questions retrieved successfully",
                "questions", questions,
                "count", questions.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve questions: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
        try {
            Optional<AptitudeQuestion> questionOpt = aptitudeQuestionService.getQuestionById(id);
            if (questionOpt.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "message", "Question retrieved successfully",
                    "question", questionOpt.get()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve question: " + e.getMessage())
            );
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody AptitudeQuestion question) {
        try {
            // Validate required fields
            if (question.getQuestion() == null || question.getQuestion().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Question is required")
                );
            }
            if (question.getOptionA() == null || question.getOptionA().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option A is required")
                );
            }
            if (question.getOptionB() == null || question.getOptionB().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option B is required")
                );
            }
            if (question.getOptionC() == null || question.getOptionC().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option C is required")
                );
            }
            if (question.getOptionD() == null || question.getOptionD().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option D is required")
                );
            }
            if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Correct answer is required")
                );
            }
            
            AptitudeQuestion savedQuestion = aptitudeQuestionService.createQuestion(question);
            return ResponseEntity.ok(Map.of(
                "message", "Question created successfully",
                "question", savedQuestion,
                "serviceVersion", "aptitude-compat-v3"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "message", "Failed to create question: " + e.getMessage(),
                    "serviceVersion", "aptitude-compat-v3"
                )
            );
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody AptitudeQuestion question) {
        try {
            // Validate required fields
            if (question.getQuestion() == null || question.getQuestion().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Question is required")
                );
            }
            if (question.getOptionA() == null || question.getOptionA().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option A is required")
                );
            }
            if (question.getOptionB() == null || question.getOptionB().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option B is required")
                );
            }
            if (question.getOptionC() == null || question.getOptionC().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option C is required")
                );
            }
            if (question.getOptionD() == null || question.getOptionD().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Option D is required")
                );
            }
            if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Correct answer is required")
                );
            }
            
            AptitudeQuestion updatedQuestion = aptitudeQuestionService.updateQuestion(id, question);
            if (updatedQuestion != null) {
                return ResponseEntity.ok(Map.of(
                    "message", "Question updated successfully",
                    "question", updatedQuestion
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to update question: " + e.getMessage())
            );
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            boolean deleted = aptitudeQuestionService.deleteQuestion(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of(
                    "message", "Question deleted successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to delete question: " + e.getMessage())
            );
        }
    }
}
