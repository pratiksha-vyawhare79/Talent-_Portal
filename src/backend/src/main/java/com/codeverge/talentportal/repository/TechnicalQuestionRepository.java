package com.codeverge.talentportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codeverge.talentportal.entity.TechnicalQuestion;

@Repository
public interface TechnicalQuestionRepository extends JpaRepository<TechnicalQuestion, Long> {
    
    List<TechnicalQuestion> findByCategory(String category);
    
    List<TechnicalQuestion> findByDifficulty(String difficulty);
    
    List<TechnicalQuestion> findByCategoryAndDifficulty(String category, String difficulty);
    
    List<TechnicalQuestion> findByCategoryOrderByCreatedAtDesc(String category);
    
    List<TechnicalQuestion> findAllByOrderByCreatedAtDesc();
}
