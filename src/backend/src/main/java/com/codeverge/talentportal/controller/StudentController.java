package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.Student;
import com.codeverge.talentportal.service.EmailService;
import com.codeverge.talentportal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175"
})
public class StudentController {
    
    @Autowired
    private StudentService studentService;

    @Autowired
    private EmailService emailService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody Student student) {
        try {
            Student registeredStudent = studentService.registerStudent(student);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Student registered successfully");
            response.put("student", registeredStudent);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Student updated successfully");
            response.put("student", updatedStudent);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Student deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/{id}/send-invitation-email")
    public ResponseEntity<?> sendInvitationEmail(@PathVariable Long id) {
        try {
            Student student = studentService.getStudentById(id);
            String email = student.getEmail();
            if (email == null || email.isBlank()) {
                throw new RuntimeException("Student email is not available");
            }

            String subject = "Interview Process Eligibility - Codeverge";
            String message =
                    "Dear Candidate,\n\n" +
                    "Congratulations!\n\n" +
                    "After careful consideration, you have been found eligible to participate in our interview process.\n\n" +
                    "The complete selection process will include the following rounds:\n\n" +
                    "1. Aptitude Test\n" +
                    "2. Technical Test\n" +
                    "3. Coding Test\n" +
                    "4. Project Round\n\n" +
                    "You are now invited to begin the first round - the Aptitude Test.\n\n" +
                    "Please follow the steps below to start the test:\n\n" +
                    "1. Go to the following link:\n" +
                    "http://localhost:5173/\n\n" +
                    "2. Click on \"Get Start\".\n\n" +
                    "3. Enter your email address.\n\n" +
                    "4. An OTP will be sent to your email.\n\n" +
                    "5. Enter the OTP to verify your email.\n\n" +
                    "6. After verification, you will be able to start the test.\n\n" +
                    "Important Instructions:\n\n" +
                    "- You must start the test within 50 minutes after receiving this email.\n" +
                    "- If you do not start the test within the given time, you will not be eligible to continue further in the process.\n\n" +
                    "We wish you the best of luck for the test.\n\n" +
                    "Best regards,\n" +
                    "Recruitment Team\n" +
                    "Codeverge";

            boolean sent = emailService.sendTestResultEmail(email, subject, message);
            if (!sent) {
                throw new RuntimeException("Failed to send email");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Invitation email sent successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Invalid student data");

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
