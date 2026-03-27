package com.codeverge.repository;

import com.codeverge.entity.CodingReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingReviewRepository extends JpaRepository<CodingReview, Long> {
    
    List<CodingReview> findByResultId(Long resultId);
    
    List<CodingReview> findByReviewerId(String reviewerId);
}
