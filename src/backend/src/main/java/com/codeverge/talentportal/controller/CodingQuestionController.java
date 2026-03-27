package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.model.CodingQuestion;
import com.codeverge.entity.CodingResult;
import com.codeverge.talentportal.service.CodingQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coding-questions")
@CrossOrigin(origins = "*")
public class CodingQuestionController {
    
    @Autowired
    private CodingQuestionService codingQuestionService;
    
    // Get all active questions
    @GetMapping("/all")
    public ResponseEntity<List<CodingQuestion>> getAllQuestions() {
        List<CodingQuestion> questions = codingQuestionService.getAllActiveQuestions();
        return ResponseEntity.ok(questions);
    }
    
    // Get question by ID
    @GetMapping("/{id}")
    public ResponseEntity<CodingQuestion> getQuestionById(@PathVariable Long id) {
        Optional<CodingQuestion> question = codingQuestionService.getQuestionById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create new question
    @PostMapping("/create")
    public ResponseEntity<CodingQuestion> createQuestion(@RequestBody CodingQuestion question) {
        try {
            CodingQuestion createdQuestion = codingQuestionService.createQuestion(question);
            return ResponseEntity.ok(createdQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update question
    @PutMapping("/update/{id}")
    public ResponseEntity<CodingQuestion> updateQuestion(@PathVariable Long id, @RequestBody CodingQuestion questionDetails) {
        Optional<CodingQuestion> updatedQuestion = codingQuestionService.updateQuestion(id, questionDetails);
        if (updatedQuestion.isPresent()) {
            return ResponseEntity.ok(updatedQuestion.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete question
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        boolean deleted = codingQuestionService.deleteQuestion(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get questions by difficulty
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByDifficulty(@PathVariable String difficulty) {
        try {
            CodingQuestion.DifficultyLevel difficultyLevel = CodingQuestion.DifficultyLevel.valueOf(difficulty.toUpperCase());
            List<CodingQuestion> questions = codingQuestionService.getQuestionsByDifficulty(difficultyLevel);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get questions by programming language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByLanguage(@PathVariable String language) {
        try {
            CodingQuestion.ProgrammingLanguage progLanguage = CodingQuestion.ProgrammingLanguage.valueOf(language.toUpperCase());
            List<CodingQuestion> questions = codingQuestionService.getQuestionsByLanguage(progLanguage);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get questions by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByType(@PathVariable String type) {
        try {
            CodingQuestion.QuestionType questionType = CodingQuestion.QuestionType.valueOf(type.toUpperCase());
            List<CodingQuestion> questions = codingQuestionService.getQuestionsByType(questionType);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Search questions
    @GetMapping("/search")
    public ResponseEntity<List<CodingQuestion>> searchQuestions(@RequestParam String q) {
        List<CodingQuestion> questions = codingQuestionService.searchQuestions(q);
        return ResponseEntity.ok(questions);
    }
    
    // Filter questions with multiple criteria
    @GetMapping("/filter")
    public ResponseEntity<List<CodingQuestion>> filterQuestions(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String type) {
        
        try {
            CodingQuestion.DifficultyLevel difficultyLevel = difficulty != null ? 
                CodingQuestion.DifficultyLevel.valueOf(difficulty.toUpperCase()) : null;
            CodingQuestion.ProgrammingLanguage progLanguage = language != null ? 
                CodingQuestion.ProgrammingLanguage.valueOf(language.toUpperCase()) : null;
            CodingQuestion.QuestionType questionType = type != null ? 
                CodingQuestion.QuestionType.valueOf(type.toUpperCase()) : null;
            
            List<CodingQuestion> questions = codingQuestionService.filterQuestions(difficultyLevel, progLanguage, questionType);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get question statistics
    @GetMapping("/stats")
    public ResponseEntity<CodingQuestionService.QuestionStats> getQuestionStats() {
        CodingQuestionService.QuestionStats stats = codingQuestionService.getQuestionStats();
        return ResponseEntity.ok(stats);
    }
    
    // Get recently added questions
    @GetMapping("/recent")
    public ResponseEntity<List<CodingQuestion>> getRecentQuestions() {
        List<CodingQuestion> questions = codingQuestionService.findRecentQuestions(true);
        return ResponseEntity.ok(questions);
    }
    
    // Get all available options for filters
    @GetMapping("/options")
    public ResponseEntity<FilterOptions> getFilterOptions() {
        FilterOptions options = new FilterOptions();
        options.setDifficulties(CodingQuestion.DifficultyLevel.values());
        options.setLanguages(CodingQuestion.ProgrammingLanguage.values());
        options.setTypes(CodingQuestion.QuestionType.values());
        return ResponseEntity.ok(options);
    }
    
    // Submit coding test results
    @PostMapping("/submit-results")
    public ResponseEntity<String> submitCodingResults(@RequestBody List<CodingResult> results) {
        try {
            codingQuestionService.saveCodingResults(results);
            return ResponseEntity.ok("Coding results saved successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving coding results: " + e.getMessage());
        }
    }
    
    // Inner class for filter options
    public static class FilterOptions {
        private CodingQuestion.DifficultyLevel[] difficulties;
        private CodingQuestion.ProgrammingLanguage[] languages;
        private CodingQuestion.QuestionType[] types;
        
        // Getters and setters
        public CodingQuestion.DifficultyLevel[] getDifficulties() { return difficulties; }
        public void setDifficulties(CodingQuestion.DifficultyLevel[] difficulties) { this.difficulties = difficulties; }
        
        public CodingQuestion.ProgrammingLanguage[] getLanguages() { return languages; }
        public void setLanguages(CodingQuestion.ProgrammingLanguage[] languages) { this.languages = languages; }
        
        public CodingQuestion.QuestionType[] getTypes() { return types; }
        public void setTypes(CodingQuestion.QuestionType[] types) { this.types = types; }
    }
}
