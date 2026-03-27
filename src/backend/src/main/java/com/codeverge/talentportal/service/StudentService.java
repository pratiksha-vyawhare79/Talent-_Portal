package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.Student;
import com.codeverge.talentportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new RuntimeException("Email is required");
        }
        return email.trim().toLowerCase();
    }
    
    public Student registerStudent(Student student) {
        String normalizedEmail = normalizeEmail(student.getEmail());
        student.setEmail(normalizedEmail);

        if (studentRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("Student with this email already exists");
        }
        return studentRepository.save(student);
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    
    public Student getStudentByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        return studentRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getStudentById(id);
        String normalizedEmail = normalizeEmail(updatedStudent.getEmail());

        if (studentRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, id)) {
            throw new RuntimeException("Student with this email already exists");
        }

        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(normalizedEmail);
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setEducation(updatedStudent.getEducation());
        existingStudent.setCollege(updatedStudent.getCollege());
        existingStudent.setYear(updatedStudent.getYear());
        existingStudent.setSkills(updatedStudent.getSkills());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        Student existingStudent = getStudentById(id);
        studentRepository.delete(existingStudent);
    }
}
