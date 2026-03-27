package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.CandidateResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateResultRepository extends JpaRepository<CandidateResult, Long> {
    
    Optional<CandidateResult> findByEmail(String email);
    
    List<CandidateResult> findByEmailOrderByTestDateDesc(String email);
    
    Optional<CandidateResult> findFirstByEmailOrderByTestDateDesc(String email);
}
