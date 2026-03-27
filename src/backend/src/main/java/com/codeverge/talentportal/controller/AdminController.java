package com.codeverge.talentportal.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeverge.talentportal.entity.Admin;
import com.codeverge.talentportal.service.AdminService;
import com.codeverge.talentportal.util.JwtUtil;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            Optional<Admin> adminOpt = adminService.authenticateAdmin(email, password);
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                
                // Generate JWT token
                String token = jwtUtil.generateToken(admin.getEmail(), admin.getId());
                
                // Create response with admin info and JWT token
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                
                Map<String, Object> adminData = new HashMap<>();
                adminData.put("id", admin.getId());
                adminData.put("email", admin.getEmail());
                
                response.put("admin", adminData);
                response.put("token", token);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(@RequestHeader("Authorization") String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body("Unauthorized");
        }

        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String adminEmail = jwtUtil.extractEmail(jwtToken);

            Optional<Admin> adminOpt = adminService.getAdminByEmail(adminEmail);
            if (adminOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Unauthorized");
            }

            Admin admin = adminOpt.get();
            Map<String, Object> adminData = new HashMap<>();
            adminData.put("id", admin.getId());
            adminData.put("email", admin.getEmail());
            return ResponseEntity.ok(adminData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unauthorized");
        }
    }
}
