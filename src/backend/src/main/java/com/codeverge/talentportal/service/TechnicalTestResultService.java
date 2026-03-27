package com.codeverge.talentportal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeverge.talentportal.model.TechnicalTestResult;
import com.codeverge.talentportal.repository.TechnicalTestResultRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class TechnicalTestResultService {
    
    @Autowired
    private TechnicalTestResultRepository technicalTestResultRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Save technical test result
     */
    public TechnicalTestResult saveTestResult(TechnicalTestResult result) {
        try {
            return technicalTestResultRepository.save(result);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save technical test result: " + e.getMessage(), e);
        }
    }
    
    /**
     * Save technical test result with metadata
     */
    public TechnicalTestResult saveTestResultWithMetadata(
            Map<String, Object> resultData, 
            HttpServletRequest request) {
        
        try {
            TechnicalTestResult result = new TechnicalTestResult();
            
            // Extract basic result data - direct field mapping
            String candidateEmail = (String) resultData.get("candidateEmail");
            String candidateName = (String) resultData.get("candidateName");
            if (candidateEmail == null || candidateEmail.trim().isEmpty()) {
                candidateEmail = "unknown@local";
            }
            if (candidateName == null || candidateName.trim().isEmpty()) {
                candidateName = "Unknown";
            }
            result.setCandidateEmail(candidateEmail.trim().toLowerCase());
            result.setCandidateName(candidateName.trim());
            
            // Extract total stats - direct field mapping
            result.setTotalQuestions(orZero(asInteger(resultData.get("totalQuestions"))));
            result.setTotalCorrect(orZero(asInteger(resultData.get("totalCorrect"))));
            result.setTotalAnswered(orZero(asInteger(resultData.get("totalAnswered"))));
            
            // Extract score data - direct field mapping
            result.setPercentageScore(orZero(asDouble(resultData.get("percentageScore"))));
            result.setTimeTakenSeconds(orZero(asInteger(resultData.get("timeTakenSeconds"))));
            result.setPassed(orFalse(asBoolean(resultData.get("passed"))));
            
            // Extract section data
            result.setSectionData((String) resultData.get("sectionData"));
            
            // Extract technical section data
            result.setTechnicalSectionScore(orZero(asInteger(resultData.get("technicalSectionScore"))));
            result.setTechnicalSectionTotal(orZero(asInteger(resultData.get("technicalSectionTotal"))));
            result.setTechnicalSectionPercentage(orZero(asDouble(resultData.get("technicalSectionPercentage"))));
            
            // Set metadata from request
            if (request != null) {
                result.setIpAddress(getClientIpAddress(request));
                result.setUserAgent(request.getHeader("User-Agent"));
            }

            if (result.getTestDate() == null) {
                result.setTestDate(LocalDateTime.now());
            }
            if (result.getSubmittedAt() == null) {
                result.setSubmittedAt(LocalDateTime.now());
            }
            
            // Save the result first
            TechnicalTestResult savedResult = saveTestResult(result);
            
            // Send email notification based on pass/fail status
            try {
                if (savedResult.getPassed()) {
                    // Send pass email
                    boolean emailSent = emailService.sendTechnicalTestPassEmailStyled(
                        savedResult.getCandidateEmail(),
                        savedResult.getCandidateName()
                    );
                    
                    if (emailSent) {
                        System.out.println("✅ Technical test pass email sent to: " + savedResult.getCandidateEmail());
                    } else {
                        System.out.println("❌ Failed to send technical test pass email to: " + savedResult.getCandidateEmail());
                    }
                } else {
                    // Send fail email
                    boolean emailSent = emailService.sendTechnicalTestFailEmailStyled(
                        savedResult.getCandidateEmail(),
                        savedResult.getCandidateName()
                    );
                    
                    if (emailSent) {
                        System.out.println("✅ Technical test fail email sent to: " + savedResult.getCandidateEmail());
                    } else {
                        System.out.println("❌ Failed to send technical test fail email to: " + savedResult.getCandidateEmail());
                    }
                }
            } catch (Exception emailException) {
                System.err.println("⚠️ Error sending email notification: " + emailException.getMessage());
                // Don't fail the whole operation if email fails
            }
            
            return savedResult;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to process technical test result: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get all results for a candidate
     */
    public List<TechnicalTestResult> getResultsByCandidate(String candidateEmail) {
        return technicalTestResultRepository.findByCandidateEmailOrderBySubmittedAtDesc(candidateEmail);
    }
    
    /**
     * Get latest result for a candidate
     */
    public Optional<TechnicalTestResult> getLatestResultByCandidate(String candidateEmail) {
        return technicalTestResultRepository.findFirstByCandidateEmailOrderBySubmittedAtDesc(candidateEmail);
    }
    
    /**
     * Get all results
     */
    public List<TechnicalTestResult> getAllResults() {
        return technicalTestResultRepository.findAllByOrderBySubmittedAtDesc();
    }
    
    /**
     * Get results by pass status
     */
    public List<TechnicalTestResult> getResultsByPassStatus(Boolean passed) {
        return technicalTestResultRepository.findByPassedOrderBySubmittedAtDesc(passed);
    }
    
    /**
     * Get candidate statistics
     */
    public Object[] getCandidateStatistics(String candidateEmail) {
        return technicalTestResultRepository.getCandidateStatistics(candidateEmail);
    }
    
    /**
     * Get overall statistics
     */
    public Object[] getOverallStatistics() {
        return technicalTestResultRepository.getOverallStatistics();
    }
    
    /**
     * Get result by ID
     */
    public Optional<TechnicalTestResult> findById(Long id) {
        return technicalTestResultRepository.findById(id);
    }
    
    /**
     * Get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private Integer asInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text && !text.trim().isEmpty()) {
            return Integer.parseInt(text.trim());
        }
        return null;
    }

    private Double asDouble(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        if (value instanceof String text && !text.trim().isEmpty()) {
            return Double.parseDouble(text.trim());
        }
        return null;
    }

    private Boolean asBoolean(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Boolean bool) {
            return bool;
        }
        if (value instanceof Number number) {
            return number.intValue() != 0;
        }
        if (value instanceof String text && !text.trim().isEmpty()) {
            return Boolean.parseBoolean(text.trim());
        }
        return null;
    }

    private Integer orZero(Integer value) {
        return value == null ? 0 : value;
    }

    private Double orZero(Double value) {
        return value == null ? 0.0 : value;
    }

    private Boolean orFalse(Boolean value) {
        return value == null ? Boolean.FALSE : value;
    }
    
    /**
     * Delete technical test result by ID
     */
    public void deleteTechnicalTestResult(Long id) {
        try {
            if (technicalTestResultRepository.existsById(id)) {
                technicalTestResultRepository.deleteById(id);
            } else {
                throw new RuntimeException("Technical test result not found with ID: " + id);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete technical test result: " + e.getMessage(), e);
        }
    }
}
