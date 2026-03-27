package com.codeverge.talentportal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);

        FieldError firstError = ex.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        if (firstError != null) {
            response.put("message", firstError.getDefaultMessage());
            response.put("field", firstError.getField());
        } else {
            response.put("message", "Validation failed");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
