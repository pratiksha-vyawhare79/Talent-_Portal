package com.codeverge.talentportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailFrom;
    
    public boolean sendOTPEmail(String to, String otp) {
        try {
            String plainText = "Codeverge Talent Portal\n\n"
                    + "Your login OTP is: " + otp + "\n\n"
                    + "This OTP will expire in 10 minutes.\n"
                    + "If you did not request this OTP, please ignore this email.";

            String html = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Codeverge OTP</title>" +
                "</head>" +
                "<body style='margin:0;padding:0;background:#eef3fb;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;'>" +
                "<div style='padding:32px 16px;'>" +
                "<div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.12);'>" +
                "<div style='background:linear-gradient(135deg,#0f2d52 0%%,#1f4b7f 55%%,#f4780a 100%%);padding:36px 32px;color:#ffffff;text-align:center;'>" +
                "<div style='font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;'>Codeverge Talent Portal</div>" +
                "<h1 style='margin:12px 0 8px;font-size:30px;line-height:1.2;'>Your Secure Login OTP</h1>" +
                "<p style='margin:0;font-size:15px;opacity:0.92;'>Use the verification code below to continue your sign in.</p>" +
                "</div>" +
                "<div style='padding:36px 32px;'>" +
                "<p style='margin:0 0 18px;font-size:16px;'>Hello,</p>" +
                "<p style='margin:0 0 24px;font-size:16px;line-height:1.7;color:#475569;'>We received a request to access your Codeverge Talent Portal account. Enter this one-time password to verify your email address.</p>" +
                "<div style='margin:0 auto 24px;max-width:280px;background:#fff7ed;border:1px solid #fdba74;border-radius:16px;padding:22px 16px;text-align:center;'>" +
                "<div style='font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#9a3412;margin-bottom:10px;'>One-Time Password</div>" +
                "<div style='font-size:36px;font-weight:800;letter-spacing:10px;color:#c2410c;'>%s</div>" +
                "</div>" +
                "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:24px;'>" +
                "<p style='margin:0 0 8px;font-size:15px;font-weight:700;color:#0f172a;'>Important</p>" +
                "<p style='margin:0;font-size:14px;line-height:1.7;color:#475569;'>This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</p>" +
                "</div>" +
                "<p style='margin:0 0 10px;font-size:14px;line-height:1.7;color:#64748b;'>If you did not request this OTP, you can safely ignore this email.</p>" +
                "<p style='margin:0;font-size:14px;line-height:1.7;color:#64748b;'>Regards,<br><strong style='color:#0f172a;'>Codeverge Team</strong></p>" +
                "</div>" +
                "<div style='padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;'>" +
                "<p style='margin:0;font-size:12px;line-height:1.6;color:#94a3b8;'>This is an automated email from Codeverge Talent Portal. Please do not reply directly to this message.</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                otp
            );

            sendHtmlEmail(to, "Codeverge Talent Portal - Login OTP", plainText, html);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void sendHtmlEmail(String to, String subject, String plainText, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                "UTF-8"
        );
        helper.setFrom(mailFrom);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(plainText, htmlContent);
        mailSender.send(message);
    }
    
    public boolean sendTestResultEmail(String to, String subject, String message) {
        try {
            String plainText = "Codeverge Talent Portal\n\n" + message + "\n\nBest regards,\nCodeverge Team";
            String htmlMessage = message
                    .replace("\n\n", "</p><p style='margin:0 0 16px;line-height:1.7;color:#475569;'>")
                    .replace("\n", "<br>");

            String html = String.format(
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "<title>Codeverge Result</title>" +
                    "</head>" +
                    "<body style='margin:0;padding:0;background:#eef2ff;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;'>" +
                    "<div style='padding:32px 16px;'>" +
                    "<div style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 14px 36px rgba(15,23,42,0.12);'>" +
                    "<div style='background:linear-gradient(135deg,#0f2d52 0%%,#1f4b7f 55%%,#f4780a 100%%);padding:38px 32px;text-align:center;color:#ffffff;'>" +
                    "<div style='font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;'>Codeverge Talent Portal</div>" +
                    "<h1 style='margin:12px 0 0;font-size:30px;line-height:1.25;'>%s</h1>" +
                    "</div>" +
                    "<div style='padding:36px 32px;'>" +
                    "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;'>" +
                    "<p style='margin:0 0 16px;line-height:1.7;color:#475569;'>%s</p>" +
                    "</div>" +
                    "<div style='margin-top:24px;background:#fff7ed;border:1px solid #fdba74;border-radius:14px;padding:18px 20px;'>" +
                    "<p style='margin:0;font-size:14px;line-height:1.7;color:#9a3412;'><strong>Important:</strong> Please check your email regularly for the next updates from Codeverge Talent Portal.</p>" +
                    "</div>" +
                    "<p style='margin:24px 0 0;font-size:14px;line-height:1.7;color:#64748b;'>Best regards,<br><strong style='color:#0f172a;'>Codeverge Team</strong></p>" +
                    "</div>" +
                    "<div style='padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;'>" +
                    "<p style='margin:0;font-size:12px;line-height:1.6;color:#94a3b8;'>This is an automated email. Please do not reply directly to this message.</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>",
                    subject,
                    htmlMessage
            );

            sendHtmlEmail(to, subject, plainText, html);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendCodingCompletionEmailStyled(String to, String subject, String message) {
        try {
            String plainText = "Codeverge Talent Portal\n\n" + message + "\n\nBest regards,\nCodeverge Team";
            String htmlMessage = message
                    .replace("\n\n", "</p><p style='margin:0 0 16px;line-height:1.7;color:#475569;'>")
                    .replace("\n", "<br>");

            String html = String.format(
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "<title>Coding Test Submitted</title>" +
                    "</head>" +
                    "<body style='margin:0;padding:0;background:#eef4fb;font-family:Segoe UI,Arial,sans-serif;color:#1f2937;'>" +
                    "<div style='padding:32px 16px;'>" +
                    "<div style='max-width:660px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 16px 40px rgba(15,23,42,0.14);'>" +
                    "<div style='background:linear-gradient(135deg,#0b2447 0%%,#19376d 55%%,#f4780a 100%%);padding:40px 32px;text-align:center;color:#ffffff;'>" +
                    "<div style='font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;'>Codeverge Talent Portal</div>" +
                    "<h1 style='margin:12px 0 8px;font-size:31px;line-height:1.2;'>Coding Test Submitted</h1>" +
                    "<p style='margin:0;font-size:15px;opacity:0.92;'>Your assessment journey is complete for now.</p>" +
                    "</div>" +
                    "<div style='padding:36px 32px;'>" +
                    "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:24px;'>" +
                    "<p style='margin:0 0 16px;line-height:1.7;color:#475569;'>%s</p>" +
                    "</div>" +
                    "<div style='margin-top:24px;background:#fff7ed;border:1px solid #fdba74;border-radius:16px;padding:20px;'>" +
                    "<p style='margin:0 0 10px;font-size:15px;font-weight:700;color:#9a3412;'>What happens next</p>" +
                    "<p style='margin:0;font-size:14px;line-height:1.7;color:#9a3412;'>Our team will review your aptitude, technical, and coding performance together. Please check your email regularly for further communication.</p>" +
                    "</div>" +
                    "<div style='display:flex;gap:12px;flex-wrap:wrap;margin-top:24px;'>" +
                    "<div style='flex:1 1 150px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px;text-align:center;'>" +
                    "<div style='font-weight:800;color:#1d4ed8;'>Aptitude</div>" +
                    "<div style='font-size:13px;color:#475569;margin-top:6px;'>Completed</div>" +
                    "</div>" +
                    "<div style='flex:1 1 150px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:16px;text-align:center;'>" +
                    "<div style='font-weight:800;color:#15803d;'>Technical</div>" +
                    "<div style='font-size:13px;color:#475569;margin-top:6px;'>Completed</div>" +
                    "</div>" +
                    "<div style='flex:1 1 150px;background:#fff7ed;border:1px solid #fdba74;border-radius:14px;padding:16px;text-align:center;'>" +
                    "<div style='font-weight:800;color:#c2410c;'>Coding</div>" +
                    "<div style='font-size:13px;color:#475569;margin-top:6px;'>Completed</div>" +
                    "</div>" +
                    "</div>" +
                    "<p style='margin:26px 0 0;font-size:14px;line-height:1.7;color:#64748b;'>Best regards,<br><strong style='color:#0f172a;'>Codeverge Team</strong></p>" +
                    "</div>" +
                    "<div style='padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;'>" +
                    "<p style='margin:0;font-size:12px;line-height:1.6;color:#94a3b8;'>This is an automated email from Codeverge Talent Portal. Please do not reply directly to this message.</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>",
                    htmlMessage
            );

            sendHtmlEmail(to, subject, plainText, html);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendTechnicalTestPassEmailStyled(String to, String candidateName) {
        try {
            String subject = "Congratulations! You Passed the Technical Test";
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Technical Test Result</title>" +
                "<style>" +
                "body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#eef2ff;}" +
                ".container{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.12);}" +
                ".header{background:linear-gradient(135deg,#0f2d52 0%%,#1f4b7f 55%%,#f4780a 100%%);color:#fff;padding:36px 28px;text-align:center;}" +
                ".content{padding:32px 28px;color:#334155;line-height:1.7;}" +
                ".result-box{background:linear-gradient(135deg,#28a745 0%%,#20c997 100%%);color:#fff;padding:24px;border-radius:12px;margin:20px 0;text-align:center;}" +
                ".steps{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;}" +
                ".steps li{margin-bottom:10px;}" +
                ".footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 28px;text-align:center;color:#94a3b8;font-size:12px;}" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h1 style='margin:0;'>Technical Test Result</h1></div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<div class='result-box'><h2 style='margin:0 0 10px;'>PASS</h2><p style='margin:0;'>You have successfully qualified for the coding round.</p></div>" +
                "<div class='steps'><p style='margin-top:0;'><strong>Next Round Details</strong></p><ul>" +
                "<li>Your next round is the coding round.</li>" +
                "<li>The coding round will have 1 question.</li>" +
                "<li>The duration will be 20 minutes.</li>" +
                "</ul></div>" +
                "<p>Please keep checking your email for the next instructions.</p>" +
                "<p>Best regards,<br><strong>Codeverge Team</strong></p>" +
                "</div><div class='footer'>This is an automated email from Codeverge Talent Portal.</div></div>" +
                "</body></html>",
                candidateName
            );
            String plainText = String.format(
                "Technical Test Result: PASS\n\nDear %s,\n\nYou have successfully qualified for the coding round.\nYour next round is the coding round.\nThe coding round will have 1 question and the duration will be 20 minutes.\n\nPlease keep checking your email for the next instructions.\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            sendHtmlEmail(to, subject, plainText, emailText);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendTechnicalTestFailEmailStyled(String to, String candidateName) {
        try {
            String subject = "Technical Test Result - Next Steps";
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Technical Test Result</title>" +
                "<style>" +
                "body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#eef2ff;}" +
                ".container{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.12);}" +
                ".header{background:linear-gradient(135deg,#475569 0%%,#1e293b 100%%);color:#fff;padding:36px 28px;text-align:center;}" +
                ".content{padding:32px 28px;color:#334155;line-height:1.7;}" +
                ".result-box{background:linear-gradient(135deg,#dc3545 0%%,#ef4444 100%%);color:#fff;padding:24px;border-radius:12px;margin:20px 0;text-align:center;}" +
                ".tips{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;}" +
                ".footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 28px;text-align:center;color:#94a3b8;font-size:12px;}" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h1 style='margin:0;'>Technical Test Result</h1></div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<div class='result-box'><h2 style='margin:0 0 10px;'>FAIL</h2><p style='margin:0;'>Thank you for taking the technical test.</p></div>" +
                "<div class='tips'><p style='margin-top:0;'><strong>Keep improving</strong></p><p style='margin-bottom:0;'>Keep practicing, improve your weak areas, and come back stronger.</p></div>" +
                "<p>Best regards,<br><strong>Codeverge Team</strong></p>" +
                "</div><div class='footer'>This is an automated email from Codeverge Talent Portal.</div></div>" +
                "</body></html>",
                candidateName
            );
            String plainText = String.format(
                "Technical Test Result: FAIL\n\nDear %s,\n\nThank you for taking the technical test.\nKeep practicing, improve your weak areas, and come back stronger.\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            sendHtmlEmail(to, subject, plainText, emailText);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean sendTechnicalTestPassEmail(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("🎉 Congratulations! You've Passed the Technical Round - Codeverge Talent Portal");
            
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Congratulations - Codeverge Talent Portal</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".header .emoji { font-size: 48px; margin-bottom: 15px; display: block; }" +
                ".content { padding: 40px 30px; }" +
                ".congratulations-box { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); color: white; padding: 30px; border-radius: 8px; margin: 25px 0; text-align: center; }" +
                ".congratulations-box h2 { margin: 0 0 15px 0; font-size: 24px; font-weight: 600; }" +
                ".next-steps { background: #f8f9fa; border-left: 4px solid #667eea; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".next-steps h3 { color: #667eea; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }" +
                ".steps-list { list-style: none; padding: 0; margin: 0; }" +
                ".steps-list li { padding: 12px 0; border-bottom: 1px solid #e9ecef; display: flex; align-items: center; }" +
                ".steps-list li:last-child { border-bottom: none; }" +
                ".step-number { background: #667eea; color: white; width: 28px; height: 28px; border-radius: 50%%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px; flex-shrink: 0; }" +
                ".footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }" +
                ".footer p { margin: 0; color: #6c757d; font-size: 14px; }" +
                ".highlight { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0; color: #856404; }" +
                ".btn { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }" +
                "@media (max-width: 600px) { .container { margin: 10px; } .header, .content, .footer { padding: 25px 20px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<span class='emoji'>🎉</span>" +
                "<h1>Congratulations!</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>We are thrilled to inform you that you have successfully passed the <strong>Technical Test</strong> round of the Codeverge Talent Portal selection process.</p>" +
                "<div class='congratulations-box'>" +
                "<h2>✅ ELIGIBLE FOR NEXT ROUND: CODING ROUND</h2>" +
                "<p>Your performance in the technical assessment has qualified you for the third and final round - the Coding Round. This is your opportunity to showcase your programming skills and problem-solving abilities.</p>" +
                "</div>" +
                "<div class='next-steps'>" +
                "<h3>📝 Next Steps:</h3>" +
                "<ul class='steps-list'>" +
                "<li><span class='step-number'>1</span> Keep an eye on your email for the coding round invitation</li>" +
                "<li><span class='step-number'>2</span> Prepare for programming challenges and algorithms</li>" +
                "<li><span class='step-number'>3</span> Review data structures and problem-solving techniques</li>" +
                "</ul>" +
                "</div>" +
                "<div class='highlight'>" +
                "<p><strong>📬 Important:</strong> The coding round invitation will be sent to this email address shortly. Please ensure you check your inbox regularly (including spam folder).</p>" +
                "</div>" +
                "<p>🚀 We are excited to see your coding skills in action!</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Best regards,<br>The Codeverge Talent Portal Team</p>" +
                "<p style='font-size: 12px; color: #adb5bd; margin-top: 15px;'>This is an automated message. Please do not reply to this email.<br>For any queries, contact our support team at <a href='mailto:support@codeverge.com' style='color: #667eea;'>support@codeverge.com</a></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                
                candidateName
            );
            
            message.setText(emailText);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean sendTechnicalTestFailEmail(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("Technical Test Results - Codeverge Talent Portal");
            
            String emailText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Technical Test Results - Codeverge Talent Portal</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }" +
                ".header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".header .emoji { font-size: 48px; margin-bottom: 15px; display: block; }" +
                ".content { padding: 40px 30px; }" +
                ".result-box { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; border-radius: 8px; margin: 25px 0; text-align: center; }" +
                ".result-box h2 { margin: 0 0 15px 0; font-size: 24px; font-weight: 600; }" +
                ".encouragement-box { background: #f8f9fa; border-left: 4px solid #ffc107; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".encouragement-box h3 { color: #ffc107; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }" +
                ".steps-list { list-style: none; padding: 0; margin: 0; }" +
                ".steps-list li { padding: 12px 0; border-bottom: 1px solid #e9ecef; display: flex; align-items: center; }" +
                ".steps-list li:last-child { border-bottom: none; }" +
                ".step-icon { color: #ffc107; margin-right: 15px; font-size: 18px; flex-shrink: 0; }" +
                ".footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }" +
                ".footer p { margin: 0; color: #6c757d; font-size: 14px; }" +
                ".highlight { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 15px; margin: 20px 0; color: #0c5460; }" +
                ".btn { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }" +
                "@media (max-width: 600px) { .container { margin: 10px; } .header, .content, .footer { padding: 25px 20px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<span class='emoji'>📚</span>" +
                "<h1>Technical Test Results</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Thank you for participating in the <strong>Technical Test</strong> round of the Codeverge Talent Portal selection process.</p>" +
                "<div class='result-box'>" +
                "<h2>❌ Unfortunately, you did not meet the minimum criteria to proceed to the next round.</h2>" +
                "<p>Don't be discouraged - this is a learning opportunity to grow and improve.</p>" +
                "</div>" +
                "<div class='encouragement-box'>" +
                "<h3>💪 We encourage you to:</h3>" +
                "<ul class='steps-list'>" +
                "<li><span class='step-icon'>📖</span> Continue practicing and improving your technical skills</li>" +
                "<li><span class='step-icon'>🎯</span> Review topics where you faced challenges</li>" +
                "<li><span class='step-icon'>🔄</span> Consider applying again in the future</li>" +
                "</ul>" +
                "</div>" +
                "<div class='highlight'>" +
                "<p><strong>💡 Remember:</strong> Every expert was once a beginner. Keep learning, keep growing, and don't give up on your goals!</p>" +
                "</div>" +
                "<p>We appreciate your effort and interest in Codeverge. We wish you the best in your future endeavors.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Best regards,<br>The Codeverge Talent Portal Team</p>" +
                "<p style='font-size: 12px; color: #adb5bd; margin-top: 15px;'>This is an automated message. Please do not reply to this email.<br>For any queries, contact our support team at <a href='mailto:support@codeverge.com' style='color: #6c757d;'>support@codeverge.com</a></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                
                candidateName
            );
            
            message.setText(emailText);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // Plain text email for technical test pass
    public boolean sendTechnicalTestPassEmailPlain(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("Congratulations on Technical Test Success!");
            
            String emailText = String.format(
                "Dear %s,\n\nTechnical Test Result: PASS\n\nCongratulations! You have successfully qualified for the Coding Round. Your performance in the technical assessment demonstrates strong programming skills and problem-solving abilities.\n\nWe look forward to seeing your performance in the final round.\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            
            message.setText(emailText);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // Plain text email for technical test fail
    public boolean sendTechnicalTestFailEmailPlain(String to, String candidateName, Double percentageScore, Integer totalCorrect, Integer totalQuestions) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("Technical Test Result - Next Steps");
            
            String emailText = String.format(
                "Dear %s,\n\nTechnical Test Result: FAIL\n\nWe regret to inform you that you have not qualified for the Coding Round at this time. This is an opportunity to identify areas for improvement and strengthen your technical skills.\n\nWe encourage you to review the concepts and practice thoroughly. Your persistence and dedication will lead to success!\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            
            message.setText(emailText);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendCodingTestPassEmailStyled(String to, String candidateName) {
        try {
            String subject = "Congratulations! You Passed the Coding Test";
            String html = String.format(
                "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Coding Test Result</title>" +
                "<style>" +
                "body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#eef4fb;}" +
                ".container{max-width:620px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 14px 36px rgba(15,23,42,.12);}" +
                ".header{background:linear-gradient(135deg,#0f2d52 0%%,#1f4b7f 55%%,#f4780a 100%%);color:#fff;padding:38px 30px;text-align:center;}" +
                ".content{padding:34px 30px;color:#334155;line-height:1.7;}" +
                ".result-box{background:linear-gradient(135deg,#16a34a 0%%,#22c55e 100%%);color:#fff;padding:24px;border-radius:14px;margin:20px 0;text-align:center;}" +
                ".next-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:20px 0;}" +
                ".footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 30px;text-align:center;color:#94a3b8;font-size:12px;}" +
                "</style></head><body>" +
                "<div class='container'><div class='header'><h1 style='margin:0;'>Coding Test Result</h1></div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<div class='result-box'><h2 style='margin:0 0 10px;'>PASS</h2><p style='margin:0;'>You have passed the coding test.</p></div>" +
                "<div class='next-box'><p style='margin:0 0 10px;'><strong>Next Round</strong></p><p style='margin:0;'>Your next round is <strong>Project and Interview</strong>. We will contact you soon with further details.</p></div>" +
                "<p>Please check your email regularly for updates.</p>" +
                "<p>Best regards,<br><strong>Codeverge Team</strong></p>" +
                "</div><div class='footer'>This is an automated email from Codeverge Talent Portal.</div></div>" +
                "</body></html>",
                candidateName
            );
            String plainText = String.format(
                "Coding Test Result: PASS\n\nDear %s,\n\nYou have passed the coding test. Your next round is Project and Interview. We will contact you soon. Please check your email regularly.\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            sendHtmlEmail(to, subject, plainText, html);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendCodingTestFailEmailStyled(String to, String candidateName) {
        try {
            String subject = "Coding Test Result - Next Steps";
            String html = String.format(
                "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Coding Test Result</title>" +
                "<style>" +
                "body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#eef4fb;}" +
                ".container{max-width:620px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 14px 36px rgba(15,23,42,.12);}" +
                ".header{background:linear-gradient(135deg,#475569 0%%,#1e293b 100%%);color:#fff;padding:38px 30px;text-align:center;}" +
                ".content{padding:34px 30px;color:#334155;line-height:1.7;}" +
                ".result-box{background:linear-gradient(135deg,#dc2626 0%%,#ef4444 100%%);color:#fff;padding:24px;border-radius:14px;margin:20px 0;text-align:center;}" +
                ".info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:20px 0;}" +
                ".footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 30px;text-align:center;color:#94a3b8;font-size:12px;}" +
                "</style></head><body>" +
                "<div class='container'><div class='header'><h1 style='margin:0;'>Coding Test Result</h1></div>" +
                "<div class='content'>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<div class='result-box'><h2 style='margin:0 0 10px;'>REGRET</h2><p style='margin:0;'>We regret to inform you that you have not qualified for the next round.</p></div>" +
                "<div class='info-box'><p style='margin:0;'>Thank you for your effort and participation in the coding test. We encourage you to keep practicing and improving your skills.</p></div>" +
                "<p>Best regards,<br><strong>Codeverge Team</strong></p>" +
                "</div><div class='footer'>This is an automated email from Codeverge Talent Portal.</div></div>" +
                "</body></html>",
                candidateName
            );
            String plainText = String.format(
                "Coding Test Result: REGRET\n\nDear %s,\n\nWe regret to inform you that you have not qualified for the next round. Thank you for your effort and participation in the coding test.\n\nBest regards,\nCodeverge Team",
                candidateName
            );
            sendHtmlEmail(to, subject, plainText, html);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
