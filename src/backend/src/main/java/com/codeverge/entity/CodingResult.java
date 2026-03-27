package com.codeverge.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "coding_results")
public class CodingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "user_code", columnDefinition = "TEXT")
    private String userCode;

    @Column(name = "language")
    private String language;

    @Column(name = "score")
    private Integer score;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Column(name = "submitted_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date submittedAt;

    @Column(name = "test_session_id")
    private String testSessionId;

    // Constructors
    public CodingResult() {}

    public CodingResult(Long userId, String userName, String userEmail, Long questionId, 
                      String questionText, String userCode, String language, 
                      Integer score, Integer totalMarks, Integer timeTakenSeconds, 
                      String testSessionId) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.questionId = questionId;
        this.questionText = questionText;
        this.userCode = userCode;
        this.language = language;
        this.score = score;
        this.totalMarks = totalMarks;
        this.timeTakenSeconds = timeTakenSeconds;
        this.submittedAt = new Date();
        this.testSessionId = testSessionId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getTestSessionId() {
        return testSessionId;
    }

    public void setTestSessionId(String testSessionId) {
        this.testSessionId = testSessionId;
    }

    // Additional methods needed by service
    public Boolean getIsCorrect() {
        return score != null && score >= 10;
    }

    public String getFeedback() {
        return score != null && score >= 10 ? "Passed" : "Failed";
    }

    public String getCandidate() {
        return userName != null ? userName : "Unknown";
    }
}
