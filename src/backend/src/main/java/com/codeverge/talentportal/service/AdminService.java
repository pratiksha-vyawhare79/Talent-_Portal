package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.Admin;
import com.codeverge.talentportal.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Optional<Admin> authenticateAdmin(String email, String password) {
        if (email == null || password == null) {
            return Optional.empty();
        }
        
        String normalizedEmail = email.trim();
        String normalizedPassword = password.trim();
        
        System.out.println("Attempting to authenticate admin: " + normalizedEmail);
        Optional<Admin> adminOpt = adminRepository.findByEmailIgnoreCase(normalizedEmail);
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            System.out.println("Admin found in database");
            
            boolean passwordMatches = false;
            String storedPassword = admin.getPassword();
            
            // Primary check: BCrypt hash from admins table.
            try {
                passwordMatches = passwordEncoder.matches(normalizedPassword, storedPassword);
            } catch (IllegalArgumentException ex) {
                passwordMatches = false;
            }
            
            // Compatibility fallback: support existing plaintext rows and migrate them.
            if (!passwordMatches && storedPassword != null && storedPassword.equals(normalizedPassword)) {
                passwordMatches = true;
                admin.setPassword(passwordEncoder.encode(normalizedPassword));
            }
            
            System.out.println("Password matches: " + passwordMatches);
            
            if (passwordMatches) {
                // Update last login
                admin.setLastLogin(LocalDateTime.now());
                adminRepository.save(admin);
                System.out.println("Admin authenticated successfully");
                return Optional.of(admin);
            }
        } else {
            System.out.println("Admin not found in database");
        }
        
        System.out.println("Admin authentication failed");
        return Optional.empty();
    }
    
    public Admin createAdmin(String email, String password) {
        if (adminRepository.existsByEmail(email)) {
            throw new RuntimeException("Admin with this email already exists");
        }
        
        Admin admin = new Admin(email, passwordEncoder.encode(password));
        return adminRepository.save(admin);
    }
    
    public Optional<Admin> getAdminByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return adminRepository.findByEmailIgnoreCase(email.trim());
    }
}
