package com.codeverge.talentportal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeverge.talentportal.dto.OTPRequest;
import com.codeverge.talentportal.dto.OTPVerificationRequest;
import com.codeverge.talentportal.entity.Student;
import com.codeverge.talentportal.service.EmailService;
import com.codeverge.talentportal.service.OTPService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
})
public class AuthController {
    
    @Autowired
    private OTPService otpService;
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOTP(@RequestBody OTPRequest request) {
        try {
            String email = request.getEmail();
            
            // Validate email format
            if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid email format")
                );
            }
            
            boolean sent = otpService.sendOTP(email);
            
            if (sent) {
                return ResponseEntity.ok(
                    Map.of("message", "OTP sent successfully")
                );
            } else {
                return ResponseEntity.internalServerError().body(
                    Map.of("message", "Failed to send OTP")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody OTPVerificationRequest request) {
        try {
            String email = request.getEmail();
            String otp = request.getOtp();
            
            // Validate inputs
            if (email == null || otp == null || otp.length() != 6) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid email or OTP format")
                );
            }
            
            boolean verified = otpService.verifyOTP(email, otp);
            
            if (verified) {
                Student student = otpService.getStudentByEmail(email);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("user", Map.of(
                    "id", student.getId(),
                    "firstName", student.getFirstName(),
                    "lastName", student.getLastName(),
                    "email", student.getEmail()
                ));
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid or expired OTP")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }
    
    @PostMapping({"/send-result-email", "/auth/send-result-email"})
    public ResponseEntity<?> sendResultEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String subject = request.get("subject");
            String message = request.get("message");
            String templateType = request.get("templateType");
            
            // Validate inputs
            if (to == null || subject == null || message == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Missing required fields: to, subject, message")
                );
            }
            
            // Validate email format
            if (!to.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid email format")
                );
            }
            
            boolean sent = "coding-completion".equals(templateType)
                    ? emailService.sendCodingCompletionEmailStyled(to, subject, message)
                    : emailService.sendTestResultEmail(to, subject, message);
            
            if (sent) {
                return ResponseEntity.ok(
                    Map.of("message", "Result email sent successfully")
                );
            } else {
                return ResponseEntity.internalServerError().body(
                    Map.of("message", "Failed to send result email")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }
}
