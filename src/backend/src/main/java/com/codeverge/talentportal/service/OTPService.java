package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.OTPCode;
import com.codeverge.talentportal.entity.Student;
import com.codeverge.talentportal.repository.OTPRepository;
import com.codeverge.talentportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OTPService {
    
    @Autowired
    private OTPRepository otpRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EmailService emailService;

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new RuntimeException("Email is required");
        }
        return email.trim().toLowerCase();
    }
    
    public String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    
    @Transactional
    public boolean sendOTP(String email) {
        String normalizedEmail = normalizeEmail(email);

        // Check if user exists
        if (!studentRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("User with this email does not exist");
        }
        
        // Clean up old OTPs for this email
        otpRepository.deleteByEmailAndIsUsedTrue(normalizedEmail);
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        
        // Generate new OTP
        String otpCode = generateOTP();
        OTPCode otp = new OTPCode(normalizedEmail, otpCode);
        otpRepository.save(otp);
        
        // Send email
        return emailService.sendOTPEmail(normalizedEmail, otpCode);
    }
    
    @Transactional
    public boolean verifyOTP(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);

        // Clean up expired OTPs first
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        
        // Find valid OTP
        return otpRepository.findByEmailAndOtpCodeAndIsUsedFalse(normalizedEmail, otp)
                .map(otpCode -> {
                    // Mark OTP as used
                    otpCode.setUsed(true);
                    otpRepository.save(otpCode);
                    
                    // Mark all other OTPs for this email as used
                    List<OTPCode> activeOtps = otpRepository.findByEmailAndIsUsedFalse(normalizedEmail);
                    activeOtps.forEach(item -> item.setUsed(true));
                    otpRepository.saveAll(activeOtps);
                    
                    return true;
                })
                .orElse(false);
    }
    
    public Student getStudentByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        return studentRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}
