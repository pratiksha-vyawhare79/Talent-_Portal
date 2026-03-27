package com.codeverge.talentportal.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_questions")
public class CodingQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_text", columnDefinition = "TEXT NOT NULL")
    private String questionText;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false)
    private DifficultyLevel difficultyLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "programming_language", nullable = false)
    private ProgrammingLanguage programmingLanguage;
    
    @Column(name = "time_limit_minutes", nullable = false)
    private Integer timeLimitMinutes;
    
    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;
    
    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;
    
    @Column(name = "constraints", columnDefinition = "TEXT")
    private String constraints;
    
    @Column(name = "hints", columnDefinition = "TEXT")
    private String hints;
    
    @Column(name = "solution_code", columnDefinition = "TEXT")
    private String solutionCode;
    
    @Column(name = "test_cases", columnDefinition = "JSON")
    @JsonFormat(shape = JsonFormat.Shape.OBJECT)
    private String testCases;
    
    @Column(name = "points", nullable = false)
    private Integer points;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @Column(name = "created_by", length = 255)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum QuestionType {
        ALGORITHM, DATA_STRUCTURE, PROBLEM_SOLVING, CODING_CHALLENGE
    }
    
    public enum DifficultyLevel {
        EASY, MEDIUM, HARD
    }
    
    public enum ProgrammingLanguage {
        JAVASCRIPT, PYTHON, JAVA, CPP, C, CSHARP
    }
    
    // Constructors
    public CodingQuestion() {}
    
    public CodingQuestion(String questionText, QuestionType questionType, DifficultyLevel difficultyLevel, 
                        ProgrammingLanguage programmingLanguage, Integer timeLimitMinutes, 
                        String sampleInput, String expectedOutput, String constraints, 
                        String hints, String solutionCode, String testCases, 
                        Integer points, String createdBy) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.difficultyLevel = difficultyLevel;
        this.programmingLanguage = programmingLanguage;
        this.timeLimitMinutes = timeLimitMinutes;
        this.sampleInput = sampleInput;
        this.expectedOutput = expectedOutput;
        this.constraints = constraints;
        this.hints = hints;
        this.solutionCode = solutionCode;
        this.testCases = testCases;
        this.points = points;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    
    public DifficultyLevel getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(DifficultyLevel difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public ProgrammingLanguage getProgrammingLanguage() { return programmingLanguage; }
    public void setProgrammingLanguage(ProgrammingLanguage programmingLanguage) { this.programmingLanguage = programmingLanguage; }
    
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    
    public String getSampleInput() { return sampleInput; }
    public void setSampleInput(String sampleInput) { this.sampleInput = sampleInput; }
    
    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    
    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }
    
    public String getHints() { return hints; }
    public void setHints(String hints) { this.hints = hints; }
    
    public String getSolutionCode() { return solutionCode; }
    public void setSolutionCode(String solutionCode) { this.solutionCode = solutionCode; }
    
    public String getTestCases() { return testCases; }
    public void setTestCases(String testCases) { this.testCases = testCases; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
