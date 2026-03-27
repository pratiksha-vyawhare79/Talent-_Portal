package com.codeverge.talentportal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Initializing database tables...");
        
        try {
            // Create coding_results table
            createCodingResultsTable();
            
            // Create coding_test_summary table
            createCodingTestSummaryTable();
            
            // Create admin review system tables
            createAdminReviewTables();
            
            // Insert default email templates
            insertEmailTemplates();
            
            System.out.println("✅ Database tables created successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Error creating database tables: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createCodingResultsTable() {
        String sql = """
            CREATE TABLE IF NOT EXISTS coding_results (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                name VARCHAR(255) DEFAULT NULL,
                question_id BIGINT NOT NULL,
                question_text TEXT NOT NULL,
                user_code LONGTEXT NOT NULL,
                language VARCHAR(50) NOT NULL,
                time_taken_seconds INT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                test_session_id VARCHAR(100) NOT NULL,
                is_correct BOOLEAN DEFAULT NULL,
                score DECIMAL(5,2) DEFAULT NULL,
                feedback TEXT,
                admin_feedback TEXT,
                admin_rating INT DEFAULT NULL COMMENT '1-10 rating by admin',
                admin_reviewed_at TIMESTAMP NULL,
                admin_reviewer_id BIGINT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                -- Indexes for better performance
                INDEX idx_user_id (user_id),
                INDEX idx_question_id (question_id),
                INDEX idx_test_session_id (test_session_id),
                INDEX idx_admin_reviewer_id (admin_reviewer_id),
                INDEX idx_admin_reviewed_at (admin_reviewed_at),
                INDEX idx_user_session (user_id, test_session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Stores individual coding question answers with admin reviews and ratings';
        """;
        
        jdbcTemplate.execute(sql);
        System.out.println("✅ coding_results table created/verified");
    }

    private void createCodingTestSummaryTable() {
        String sql = """
            CREATE TABLE IF NOT EXISTS coding_test_summary (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                test_session_id VARCHAR(100) NOT NULL UNIQUE,
                total_questions INT NOT NULL,
                questions_attempted INT NOT NULL,
                total_score DECIMAL(5,2) DEFAULT 0,
                total_time_taken_seconds INT NOT NULL,
                average_score_percent DECIMAL(5,2) DEFAULT 0,
                overall_admin_rating DECIMAL(5,2) DEFAULT NULL COMMENT 'Average admin rating',
                status ENUM('PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'QUALIFIED', 'NOT_QUALIFIED') DEFAULT 'PENDING_REVIEW',
                qualification_email_sent BOOLEAN DEFAULT FALSE,
                qualification_email_sent_at TIMESTAMP NULL,
                qualified_for_project_round BOOLEAN DEFAULT FALSE,
                project_round_invitation_sent_at TIMESTAMP NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                -- Indexes
                INDEX idx_user_id (user_id),
                INDEX idx_test_session_id (test_session_id),
                INDEX idx_status (status),
                INDEX idx_qualified_for_project_round (qualified_for_project_round),
                INDEX idx_qualification_email_sent (qualification_email_sent),
                INDEX idx_completed_at (completed_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Overall coding test summary with qualification status';
        """;
        
        jdbcTemplate.execute(sql);
        System.out.println("✅ coding_test_summary table created/verified");
    }

    private void createAdminReviewTables() {
        // Admin review log table
        String reviewLogSql = """
            CREATE TABLE IF NOT EXISTS admin_review_log (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                admin_id BIGINT NOT NULL,
                user_id BIGINT NOT NULL,
                test_session_id VARCHAR(100) NOT NULL,
                action_type ENUM('REVIEW_STARTED', 'RATING_ASSIGNED', 'FEEDBACK_ADDED', 'STATUS_CHANGED', 'EMAIL_SENT') NOT NULL,
                action_details TEXT,
                previous_status VARCHAR(50) NULL,
                new_status VARCHAR(50) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Indexes
                INDEX idx_admin_id (admin_id),
                INDEX idx_user_id (user_id),
                INDEX idx_test_session_id (test_session_id),
                INDEX idx_action_type (action_type),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Tracks all admin actions for audit trail';
        """;
        
        jdbcTemplate.execute(reviewLogSql);
        
        // Email templates table
        String emailTemplatesSql = """
            CREATE TABLE IF NOT EXISTS email_templates (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                template_name VARCHAR(100) NOT NULL UNIQUE,
                subject VARCHAR(255) NOT NULL,
                html_content LONGTEXT NOT NULL,
                text_content LONGTEXT,
                variables JSON COMMENT 'Template variables in JSON format',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                -- Indexes
                INDEX idx_template_name (template_name),
                INDEX idx_is_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Email templates for automated communications';
        """;
        
        jdbcTemplate.execute(emailTemplatesSql);
        
        // Email queue table
        String emailQueueSql = """
            CREATE TABLE IF NOT EXISTS email_queue (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                to_email VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                html_content LONGTEXT NOT NULL,
                text_content LONGTEXT,
                template_variables JSON,
                status ENUM('PENDING', 'SENT', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
                attempts INT DEFAULT 0,
                max_attempts INT DEFAULT 3,
                sent_at TIMESTAMP NULL,
                error_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                -- Indexes
                INDEX idx_to_email (to_email),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at),
                INDEX idx_sent_at (sent_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Queue for sending emails to candidates';
        """;
        
        jdbcTemplate.execute(emailQueueSql);
        
        // Project round candidates table
        String projectCandidatesSql = """
            CREATE TABLE IF NOT EXISTS project_round_candidates (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                coding_test_session_id VARCHAR(100) NOT NULL,
                invitation_sent BOOLEAN DEFAULT FALSE,
                invitation_sent_at TIMESTAMP NULL,
                invitation_accepted BOOLEAN DEFAULT NULL,
                invitation_accepted_at TIMESTAMP NULL,
                project_assigned BOOLEAN DEFAULT FALSE,
                project_assigned_at TIMESTAMP NULL,
                project_details TEXT,
                status ENUM('INVITED', 'ACCEPTED', 'DECLINED', 'ASSIGNED', 'COMPLETED') DEFAULT 'INVITED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                -- Indexes
                INDEX idx_user_id (user_id),
                INDEX idx_coding_test_session_id (coding_test_session_id),
                INDEX idx_status (status),
                INDEX idx_invitation_sent (invitation_sent),
                INDEX idx_invitation_accepted (invitation_accepted)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Manages candidates who qualified for project round';
        """;
        
        jdbcTemplate.execute(projectCandidatesSql);
        
        System.out.println("✅ Admin review system tables created/verified");
    }

    private void insertEmailTemplates() {
        // Check if templates already exist
        String checkSql = "SELECT COUNT(*) FROM email_templates WHERE template_name = 'CODING_TEST_QUALIFIED'";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class);
        
        if (count == 0) {
            // Insert qualification email template
            String qualifiedTemplateSql = """
                INSERT INTO email_templates (template_name, subject, html_content, text_content, variables) VALUES 
                (
                    'CODING_TEST_QUALIFIED',
                    'Congratulations! You Have Qualified for the Project Round',
                    '<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Coding Test Qualification</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            .header { text-align: center; color: #F4780A; margin-bottom: 30px; }
                            .content { line-height: 1.6; color: #333; }
                            .cta-button { display: inline-block; padding: 12px 30px; background-color: #F4780A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🎉 Congratulations!</h1>
                                <h2>You Have Qualified for the Project Round</h2>
                            </div>
                            <div class="content">
                                <p>Dear {{user_name}},</p>
                                <p>We are pleased to inform you that you have successfully passed the coding test and have been selected for the next round - the Project Round.</p>
                                <p><strong>Your Performance:</strong></p>
                                <ul>
                                    <li>Total Questions: {{total_questions}}</li>
                                    <li>Overall Rating: {{admin_rating}}/10</li>
                                    <li>Time Taken: {{time_taken}}</li>
                                </ul>
                                <p>Your coding skills and problem-solving abilities have impressed our technical team, and we believe you would be a great fit for our project development team.</p>
                                <p><strong>Next Steps:</strong></p>
                                <ol>
                                    <li>You will receive project details and requirements</li>
                                    <li>Complete the assigned project within the given timeline</li>
                                    <li>Submit your project for final evaluation</li>
                                </ol>
                                <p>We are excited to see what you can build! This is your opportunity to showcase your skills on a real-world project.</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="{{dashboard_url}}" class="cta-button">View Project Details</a>
                                </div>
                                <p>If you have any questions, please don''t hesitate to contact us.</p>
                                <p>Best regards,<br>The Talent Portal Team</p>
                            </div>
                            <div class="footer">
                                <p>© 2024 Talent Portal. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>',
                    'Dear {{user_name}},

                    Congratulations! You have successfully passed the coding test and have been selected for the Project Round.

                    Your Performance:
                    - Total Questions: {{total_questions}}
                    - Overall Rating: {{admin_rating}}/10
                    - Time Taken: {{time_taken}}

                    Your coding skills and problem-solving abilities have impressed our technical team, and we believe you would be a great fit for our project development team.

                    Next Steps:
                    1. You will receive project details and requirements
                    2. Complete the assigned project within the given timeline
                    3. Submit your project for final evaluation

                    We are excited to see what you can build! This is your opportunity to showcase your skills on a real-world project.

                    View Project Details: {{dashboard_url}}

                    Best regards,
                    The Talent Portal Team',
                    '{"user_name": "User Name", "total_questions": "5", "admin_rating": "8.5", "time_taken": "45 minutes", "dashboard_url": "http://localhost:5173/dashboard"}'
                )
            """;
            
            jdbcTemplate.update(qualifiedTemplateSql);
            
            // Insert rejection email template
            String rejectedTemplateSql = """
                INSERT INTO email_templates (template_name, subject, html_content, text_content, variables) VALUES 
                (
                    'CODING_TEST_REJECTED',
                    'Update on Your Coding Test Results',
                    '<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Coding Test Results</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                            .header { text-align: center; color: #666; margin-bottom: 30px; }
                            .content { line-height: 1.6; color: #333; }
                            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>📋 Coding Test Results</h1>
                            </div>
                            <div class="content">
                                <p>Dear {{user_name}},</p>
                                <p>Thank you for participating in our coding test. We have carefully reviewed your submission.</p>
                                <p>After thorough evaluation by our technical team, we regret to inform you that your performance did not meet the criteria for advancing to the next round at this time.</p>
                                <p><strong>Your Performance:</strong></p>
                                <ul>
                                    <li>Total Questions: {{total_questions}}</li>
                                    <li>Overall Rating: {{admin_rating}}/10</li>
                                    <li>Time Taken: {{time_taken}}</li>
                                </ul>
                                <p>We appreciate the effort you put into the test and encourage you to continue developing your skills. You may apply again in the future after further practice and preparation.</p>
                                <p>Best regards,<br>The Talent Portal Team</p>
                            </div>
                            <div class="footer">
                                <p>© 2024 Talent Portal. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>',
                    'Dear {{user_name}},

                    Thank you for participating in our coding test. We have carefully reviewed your submission.

                    After thorough evaluation by our technical team, we regret to inform you that your performance did not meet the criteria for advancing to the next round at this time.

                    Your Performance:
                    - Total Questions: {{total_questions}}
                    - Overall Rating: {{admin_rating}}/10
                    - Time Taken: {{time_taken}}

                    We appreciate the effort you put into the test and encourage you to continue developing your skills. You may apply again in the future after further practice and preparation.

                    Best regards,
                    The Talent Portal Team',
                    '{"user_name": "User Name", "total_questions": "5", "admin_rating": "4.5", "time_taken": "45 minutes"}'
                )
            """;
            
            jdbcTemplate.update(rejectedTemplateSql);
            
            System.out.println("✅ Default email templates inserted");
        } else {
            System.out.println("✅ Email templates already exist");
        }
    }
}
