package com.codeverge.talentportal.config;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.FileCopyUtils;

@Configuration
public class DataInitializationConfig {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Bean
    public CommandLineRunner initializeTechnicalTestResultsTable() {
        return args -> {
            try {
                // Check if table already exists
                try (Connection connection = jdbcTemplate.getDataSource().getConnection()) {
                    try (Statement statement = connection.createStatement()) {
                        // Check if table exists
                        var resultSet = statement.executeQuery(
                            "SHOW TABLES LIKE 'technical_test_results'"
                        );
                        
                        if (!resultSet.next()) {
                            // Table doesn't exist, create it
                            System.out.println("Creating technical_test_results table...");
                            
                            // Read and execute simplified SQL file
                            var resource = new ClassPathResource("technical_test_results_auto.sql");
                            try (var reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
                                String sql = FileCopyUtils.copyToString(reader);
                                String[] statements = sql.split(";");
                                for (String stmt : statements) {
                                    String cleaned = stmt.replaceAll("(?m)^\\s*--.*$", "").trim();
                                    if (cleaned.isEmpty()) {
                                        continue;
                                    }
                                    statement.execute(cleaned);
                                }
                                
                                System.out.println("technical_test_results table created successfully!");
                            }
                        } else {
                            System.out.println("technical_test_results table already exists.");
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error initializing technical_test_results table: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
