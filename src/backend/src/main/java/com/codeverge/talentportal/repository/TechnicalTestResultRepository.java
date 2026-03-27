package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.model.TechnicalTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicalTestResultRepository extends JpaRepository<TechnicalTestResult, Long> {
    
    // Find by candidate email
    List<TechnicalTestResult> findByCandidateEmailOrderBySubmittedAtDesc(String candidateEmail);
    
    // Find latest result for a candidate
    Optional<TechnicalTestResult> findFirstByCandidateEmailOrderBySubmittedAtDesc(String candidateEmail);
    
    // Find by pass status
    List<TechnicalTestResult> findByPassedOrderBySubmittedAtDesc(Boolean passed);
    
    // Find results within date range
    List<TechnicalTestResult> findByTestDateBetweenOrderBySubmittedAtDesc(
        LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by candidate email and date range
    List<TechnicalTestResult> findByCandidateEmailAndTestDateBetweenOrderBySubmittedAtDesc(
        String candidateEmail, LocalDateTime startDate, LocalDateTime endDate);
    
    // Count results by candidate
    Long countByCandidateEmail(String candidateEmail);
    
    // Count passed results
    Long countByPassed(Boolean passed);
    
    // Find all results ordered by submission date
    List<TechnicalTestResult> findAllByOrderBySubmittedAtDesc();
    
    // Get statistics for a candidate
    @Query("SELECT " +
           "COUNT(t) as totalAttempts, " +
           "AVG(t.percentageScore) as averageScore, " +
           "MAX(t.percentageScore) as highestScore, " +
           "SUM(CASE WHEN t.passed = true THEN 1 ELSE 0 END) as passedAttempts " +
           "FROM TechnicalTestResult t WHERE t.candidateEmail = :email")
    Object[] getCandidateStatistics(@Param("email") String email);
    
    // Get overall statistics
    @Query("SELECT " +
           "COUNT(t) as totalAttempts, " +
           "AVG(t.percentageScore) as averageScore, " +
           "SUM(CASE WHEN t.passed = true THEN 1 ELSE 0 END) as passedAttempts " +
           "FROM TechnicalTestResult t")
    Object[] getOverallStatistics();
}
