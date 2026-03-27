package com.codeverge.talentportal.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    
    public static void main(String[] args) {
        if (args.length == 0 || args[0].isBlank()) {
            System.out.println("Usage: java PasswordUtil <plainPassword>");
            return;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args[0];
        String encodedPassword = encoder.encode(password);
        
        System.out.println("Original password: " + password);
        System.out.println("Encoded password: " + encodedPassword);
        
        // Test verification
        boolean matches = encoder.matches(password, encodedPassword);
        System.out.println("Password matches: " + matches);
    }
}
