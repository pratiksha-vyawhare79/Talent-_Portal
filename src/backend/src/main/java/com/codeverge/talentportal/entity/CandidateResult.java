package com.codeverge.talentportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_results")
public class CandidateResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "student_name", nullable = false)
    private String studentName;
    
    @Column(name = "numerical_score")
    private Integer numericalScore;
    
    @Column(name = "reasoning_score")
    private Integer reasoningScore;
    
    @Column(name = "verbal_score")
    private Integer verbalScore;
    
    @Column(name = "total_marks")
    private Integer totalMarks;
    
    @Column(name = "final_result")
    private String finalResult;
    
    @Column(name = "test_date")
    private LocalDateTime testDate;
    
    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;
    
    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public CandidateResult() {}
    
    public CandidateResult(String email, String studentName, Integer numericalScore, 
                         Integer reasoningScore, Integer verbalScore, 
                         Integer totalMarks, String finalResult, 
                         Integer timeTakenMinutes, Integer timeTakenSeconds) {
        this.email = email;
        this.studentName = studentName;
        this.numericalScore = numericalScore;
        this.reasoningScore = reasoningScore;
        this.verbalScore = verbalScore;
        this.totalMarks = totalMarks;
        this.finalResult = finalResult;
        this.testDate = LocalDateTime.now();
        this.timeTakenMinutes = timeTakenMinutes;
        this.timeTakenSeconds = timeTakenSeconds;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (testDate == null) testDate = LocalDateTime.now();
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (numericalScore == null) numericalScore = 0;
        if (reasoningScore == null) reasoningScore = 0;
        if (verbalScore == null) verbalScore = 0;
        if (totalMarks == null) totalMarks = 0;
        if (timeTakenMinutes == null) timeTakenMinutes = 0;
        if (timeTakenSeconds == null) timeTakenSeconds = 0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public Integer getNumericalScore() { return numericalScore; }
    public void setNumericalScore(Integer numericalScore) { this.numericalScore = numericalScore; }
    
    public Integer getReasoningScore() { return reasoningScore; }
    public void setReasoningScore(Integer reasoningScore) { this.reasoningScore = reasoningScore; }
    
    public Integer getVerbalScore() { return verbalScore; }
    public void setVerbalScore(Integer verbalScore) { this.verbalScore = verbalScore; }
    
    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }
    
    public String getFinalResult() { return finalResult; }
    public void setFinalResult(String finalResult) { this.finalResult = finalResult; }
    
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    
    public Integer getTimeTakenMinutes() { return timeTakenMinutes; }
    public void setTimeTakenMinutes(Integer timeTakenMinutes) { this.timeTakenMinutes = timeTakenMinutes; }
    
    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
