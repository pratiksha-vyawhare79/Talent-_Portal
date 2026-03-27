package com.codeverge.talentportal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.codeverge.talentportal.model.CodingQuestion;
import com.codeverge.talentportal.model.CodingQuestion.DifficultyLevel;
import com.codeverge.talentportal.model.CodingQuestion.ProgrammingLanguage;
import com.codeverge.talentportal.model.CodingQuestion.QuestionType;

@Repository
public interface CodingQuestionRepository extends JpaRepository<CodingQuestion, Long> {
    
    // Find all active questions
    List<CodingQuestion> findByIsActiveOrderByDifficultyLevelAsc(Boolean isActive);
    
    // Find by difficulty level
    List<CodingQuestion> findByDifficultyLevelAndIsActiveOrderByCreatedAtDesc(DifficultyLevel difficultyLevel, Boolean isActive);
    
    // Find by programming language
    List<CodingQuestion> findByProgrammingLanguageAndIsActiveOrderByCreatedAtDesc(ProgrammingLanguage programmingLanguage, Boolean isActive);
    
    // Find by question type
    List<CodingQuestion> findByQuestionTypeAndIsActiveOrderByCreatedAtDesc(QuestionType questionType, Boolean isActive);
    
    // Find by multiple criteria
    @Query("SELECT cq FROM CodingQuestion cq WHERE cq.isActive = :isActive AND " +
           "(:difficultyLevel IS NULL OR cq.difficultyLevel = :difficultyLevel) AND " +
           "(:programmingLanguage IS NULL OR cq.programmingLanguage = :programmingLanguage) AND " +
           "(:questionType IS NULL OR cq.questionType = :questionType) ORDER BY cq.createdAt DESC")
    List<CodingQuestion> findByMultipleFilters(Boolean isActive, DifficultyLevel difficultyLevel, 
                                              ProgrammingLanguage programmingLanguage, 
                                              QuestionType questionType);
    
    // Find by ID
    Optional<CodingQuestion> findByIdAndIsActive(Long id, Boolean isActive);
    
    // Search questions by text
    @Query("SELECT cq FROM CodingQuestion cq WHERE cq.isActive = :isActive AND " +
           "(LOWER(cq.questionText) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(cq.constraints) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(cq.hints) LIKE LOWER(CONCAT('%', :searchText, '%'))) ORDER BY cq.createdAt DESC")
    List<CodingQuestion> searchQuestions(Boolean isActive, String searchText);
    
    // Count questions by difficulty
    long countByDifficultyLevelAndIsActive(DifficultyLevel difficultyLevel, Boolean isActive);
    
    // Count all active questions
    long countByIsActive(Boolean isActive);
    
    // Find recently added questions
    @Query("SELECT cq FROM CodingQuestion cq WHERE cq.isActive = :isActive ORDER BY cq.createdAt DESC")
    List<CodingQuestion> findRecentQuestions(Boolean isActive);

    // Hard delete by ID (returns number of rows deleted)
    @Modifying
    @Query("DELETE FROM CodingQuestion cq WHERE cq.id = :id")
    int deleteByIdHard(@Param("id") Long id);
}
