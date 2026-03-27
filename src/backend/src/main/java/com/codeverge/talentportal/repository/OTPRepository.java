package com.codeverge.talentportal.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeverge.talentportal.entity.OTPCode;

@Repository
public interface OTPRepository extends JpaRepository<OTPCode, Long> {
    
    Optional<OTPCode> findByEmailAndOtpCodeAndIsUsedFalse(String email, String otpCode);
    
    List<OTPCode> findByEmailAndIsUsedFalse(String email);

    long deleteByEmailAndIsUsedTrue(String email);

    long deleteByExpiresAtBefore(LocalDateTime now);
}
