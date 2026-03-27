package com.codeverge.talentportal.service;

import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeverge.talentportal.model.CodingQuestion;
import com.codeverge.entity.CodingResult;
import com.codeverge.talentportal.repository.CodingQuestionRepository;

@Service
@Transactional
public class CodingQuestionService {
    
    @Autowired
    private CodingQuestionRepository codingQuestionRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // Get all active questions
    public List<CodingQuestion> getAllActiveQuestions() {
        return codingQuestionRepository.findByIsActiveOrderByDifficultyLevelAsc(true);
    }
    
    // Get question by ID
    public Optional<CodingQuestion> getQuestionById(Long id) {
        return codingQuestionRepository.findByIdAndIsActive(id, true);
    }
    
    // Create new question
    public CodingQuestion createQuestion(CodingQuestion question) {
        question.setCreatedAt(java.time.LocalDateTime.now());
        question.setUpdatedAt(java.time.LocalDateTime.now());
        question.setIsActive(true);
        return codingQuestionRepository.save(question);
    }
    
    // Update question
    public Optional<CodingQuestion> updateQuestion(Long id, CodingQuestion questionDetails) {
        Optional<CodingQuestion> existingQuestion = codingQuestionRepository.findByIdAndIsActive(id, true);
        if (existingQuestion.isPresent()) {
            CodingQuestion question = existingQuestion.get();
            question.setQuestionText(questionDetails.getQuestionText());
            question.setQuestionType(questionDetails.getQuestionType());
            question.setDifficultyLevel(questionDetails.getDifficultyLevel());
            question.setProgrammingLanguage(questionDetails.getProgrammingLanguage());
            question.setTimeLimitMinutes(questionDetails.getTimeLimitMinutes());
            question.setSampleInput(questionDetails.getSampleInput());
            question.setExpectedOutput(questionDetails.getExpectedOutput());
            question.setConstraints(questionDetails.getConstraints());
            question.setHints(questionDetails.getHints());
            question.setSolutionCode(questionDetails.getSolutionCode());
            question.setTestCases(questionDetails.getTestCases());
            question.setPoints(questionDetails.getPoints());
            question.setUpdatedAt(java.time.LocalDateTime.now());
            return Optional.of(codingQuestionRepository.save(question));
        }
        return Optional.empty();
    }
    
    // Delete question (permanent delete)
    public boolean deleteQuestion(Long id) {
        int deleted = codingQuestionRepository.deleteByIdHard(id);
        return deleted > 0;
    }
    
    // Get questions by difficulty
    public List<CodingQuestion> getQuestionsByDifficulty(CodingQuestion.DifficultyLevel difficulty) {
        return codingQuestionRepository.findByDifficultyLevelAndIsActiveOrderByCreatedAtDesc(difficulty, true);
    }
    
    // Get questions by programming language
    public List<CodingQuestion> getQuestionsByLanguage(CodingQuestion.ProgrammingLanguage language) {
        return codingQuestionRepository.findByProgrammingLanguageAndIsActiveOrderByCreatedAtDesc(language, true);
    }
    
    // Get questions by type
    public List<CodingQuestion> getQuestionsByType(CodingQuestion.QuestionType type) {
        return codingQuestionRepository.findByQuestionTypeAndIsActiveOrderByCreatedAtDesc(type, true);
    }
    
    // Search questions
    public List<CodingQuestion> searchQuestions(String searchText) {
        if (searchText == null || searchText.trim().isEmpty()) {
            return getAllActiveQuestions();
        }
        return codingQuestionRepository.searchQuestions(true, searchText.toLowerCase());
    }
    
    // Filter questions
    public List<CodingQuestion> filterQuestions(CodingQuestion.DifficultyLevel difficulty, 
                                           CodingQuestion.ProgrammingLanguage language, 
                                           CodingQuestion.QuestionType type) {
        return codingQuestionRepository.findByMultipleFilters(true, difficulty, language, type);
    }
    
    // Get statistics
    public QuestionStats getQuestionStats() {
        List<CodingQuestion> allQuestions = getAllActiveQuestions();
        QuestionStats stats = new QuestionStats();
        
        stats.setTotalQuestions(allQuestions.size());
        stats.setEasyQuestions((int) allQuestions.stream()
            .filter(q -> q.getDifficultyLevel() == CodingQuestion.DifficultyLevel.EASY)
            .count());
        stats.setMediumQuestions((int) allQuestions.stream()
            .filter(q -> q.getDifficultyLevel() == CodingQuestion.DifficultyLevel.MEDIUM)
            .count());
        stats.setHardQuestions((int) allQuestions.stream()
            .filter(q -> q.getDifficultyLevel() == CodingQuestion.DifficultyLevel.HARD)
            .count());
        
        return stats;
    }

    public List<CodingQuestion> findRecentQuestions(boolean isActive) {
        List<CodingQuestion> recentQuestions = codingQuestionRepository.findRecentQuestions(isActive);
        // Return only the 10 most recent questions
        return recentQuestions.stream().limit(10).toList();
    }
    
    // Save coding test results
    @Transactional
    public void saveCodingResults(List<CodingResult> results) {
        if (results == null || results.isEmpty()) {
            return;
        }

        String sql = """
            INSERT INTO coding_results (
                user_id,
                name,
                question_id,
                question_text,
                user_code,
                language,
                time_taken_seconds,
                submitted_at,
                test_session_id,
                is_correct,
                score,
                feedback
            ) VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?, ?, ?)
        """;

        List<Object[]> batchArgs = results.stream().map(result -> {
            long userId = result.getUserId() != null ? result.getUserId() : 0L;
            String candidate = resolveCandidateName(result, userId);
            long questionId = result.getQuestionId() != null ? result.getQuestionId() : 0L;
            String questionText = result.getQuestionText() != null ? result.getQuestionText() : "";
            String userCode = result.getUserCode() != null ? result.getUserCode() : "";
            String language = result.getLanguage() != null ? result.getLanguage() : "UNKNOWN";
            int timeTakenSeconds = result.getTimeTakenSeconds() != null ? result.getTimeTakenSeconds() : 0;
            String testSessionId = result.getTestSessionId() != null ? result.getTestSessionId() : ("session_" + System.currentTimeMillis());

            Timestamp submittedAt = null;
            if (result.getSubmittedAt() != null) {
                submittedAt = new Timestamp(result.getSubmittedAt().getTime());
            }

            return new Object[]{
                userId,
                candidate,
                questionId,
                questionText,
                userCode,
                language,
                timeTakenSeconds,
                submittedAt,
                testSessionId,
                result.getIsCorrect(),
                result.getScore(),
                result.getFeedback()
            };
        }).collect(java.util.stream.Collectors.toList());

        int[] inserted = jdbcTemplate.batchUpdate(sql, batchArgs);

        int total = 0;
        for (int i : inserted) {
            total += i;
        }
        System.out.println("✅ coding_results inserted rows: " + total);
    }
    
    private String resolveCandidateName(CodingResult result, long userId) {
        String candidate = result.getCandidate();
        if (candidate != null && !candidate.isBlank()) {
            return candidate.trim();
        }

        if (userId > 0) {
            try {
                String sql = """
                    SELECT TRIM(CONCAT(IFNULL(first_name, ''), ' ', IFNULL(last_name, '')))
                    FROM students
                    WHERE id = ?
                """;
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId);
                if (!rows.isEmpty()) {
                    Object value = rows.get(0).values().stream().findFirst().orElse(null);
                    String name = value != null ? value.toString().trim() : "";
                    if (!name.isBlank()) {
                        return name;
                    }
                }
            } catch (Exception ignored) {
                // Fallback below
            }
        }

        return "Candidate";
    }

    // Inner class for statistics
    public static class QuestionStats {
        private int totalQuestions;
        private int easyQuestions;
        private int mediumQuestions;
        private int hardQuestions;
        
        // Getters and setters
        public int getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
        
        public int getEasyQuestions() { return easyQuestions; }
        public void setEasyQuestions(int easyQuestions) { this.easyQuestions = easyQuestions; }
        
        public int getMediumQuestions() { return mediumQuestions; }
        public void setMediumQuestions(int mediumQuestions) { this.mediumQuestions = mediumQuestions; }
        
        public int getHardQuestions() { return hardQuestions; }
        public void setHardQuestions(int hardQuestions) { this.hardQuestions = hardQuestions; }
    }
}
