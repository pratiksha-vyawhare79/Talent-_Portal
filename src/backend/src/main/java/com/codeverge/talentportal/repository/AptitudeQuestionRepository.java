package com.codeverge.talentportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeverge.talentportal.entity.AptitudeQuestion;

@Repository
public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, Long> {
    
    List<AptitudeQuestion> findByCategory(String category);
    
    List<AptitudeQuestion> findByDifficulty(String difficulty);
    
    List<AptitudeQuestion> findByCategoryAndDifficulty(String category, String difficulty);
    
    List<AptitudeQuestion> findByCategoryOrderByCreatedAtDesc(String category);
    
    List<AptitudeQuestion> findAllByOrderByCreatedAtDesc();
}
