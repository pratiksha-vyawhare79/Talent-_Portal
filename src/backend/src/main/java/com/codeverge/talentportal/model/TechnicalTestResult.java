package com.codeverge.talentportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "technical_test_results")
public class TechnicalTestResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "candidate_email", nullable = false)
    private String candidateEmail;
    
    @Column(name = "candidate_name", nullable = false)
    private String candidateName;
    
    @Column(name = "test_date")
    private LocalDateTime testDate;
    
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;
    
    @Column(name = "total_correct", nullable = false)
    private Integer totalCorrect;
    
    @Column(name = "total_answered", nullable = false)
    private Integer totalAnswered;
    
    @Column(name = "percentage_score", nullable = false)
    private Double percentageScore;
    
    @Column(name = "time_taken_seconds", nullable = false)
    private Integer timeTakenSeconds;
    
    @Column(name = "passed", nullable = false)
    private Boolean passed;
    
    @Column(name = "section_data", columnDefinition = "TEXT")
    private String sectionData;
    
    @Column(name = "technical_section_score")
    private Integer technicalSectionScore;
    
    @Column(name = "technical_section_total")
    private Integer technicalSectionTotal;
    
    @Column(name = "technical_section_percentage")
    private Double technicalSectionPercentage;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    // Constructors
    public TechnicalTestResult() {}
    
    public TechnicalTestResult(String candidateEmail, String candidateName, Integer totalQuestions, 
                          Integer totalCorrect, Integer totalAnswered, Double percentageScore, 
                          Integer timeTakenSeconds, Boolean passed) {
        this.candidateEmail = candidateEmail;
        this.candidateName = candidateName;
        this.totalQuestions = totalQuestions;
        this.totalCorrect = totalCorrect;
        this.totalAnswered = totalAnswered;
        this.percentageScore = percentageScore;
        this.timeTakenSeconds = timeTakenSeconds;
        this.passed = passed;
        this.testDate = LocalDateTime.now();
        this.submittedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }
    
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public Integer getTotalCorrect() { return totalCorrect; }
    public void setTotalCorrect(Integer totalCorrect) { this.totalCorrect = totalCorrect; }
    
    public Integer getTotalAnswered() { return totalAnswered; }
    public void setTotalAnswered(Integer totalAnswered) { this.totalAnswered = totalAnswered; }
    
    public Double getPercentageScore() { return percentageScore; }
    public void setPercentageScore(Double percentageScore) { this.percentageScore = percentageScore; }
    
    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
    
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    
    public String getSectionData() { return sectionData; }
    public void setSectionData(String sectionData) { this.sectionData = sectionData; }
    
    public Integer getTechnicalSectionScore() { return technicalSectionScore; }
    public void setTechnicalSectionScore(Integer technicalSectionScore) { this.technicalSectionScore = technicalSectionScore; }
    
    public Integer getTechnicalSectionTotal() { return technicalSectionTotal; }
    public void setTechnicalSectionTotal(Integer technicalSectionTotal) { this.technicalSectionTotal = technicalSectionTotal; }
    
    public Double getTechnicalSectionPercentage() { return technicalSectionPercentage; }
    public void setTechnicalSectionPercentage(Double technicalSectionPercentage) { this.technicalSectionPercentage = technicalSectionPercentage; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
