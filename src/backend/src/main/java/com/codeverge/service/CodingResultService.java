package com.codeverge.service;

import com.codeverge.entity.CodingResult;
import com.codeverge.entity.CodingReview;
import com.codeverge.repository.CodingResultRepository;
import com.codeverge.repository.CodingReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CodingResultService {

    @Autowired
    private CodingResultRepository codingResultRepository;

    @Autowired
    private CodingReviewRepository codingReviewRepository;

    public List<CodingResult> getAllCodingResults() {
        return codingResultRepository.findAll();
    }

    public CodingResult getCodingResultById(Long id) {
        Optional<CodingResult> result = codingResultRepository.findById(id);
        return result.orElse(null);
    }

    public CodingResult saveCodingResult(CodingResult codingResult) {
        return codingResultRepository.save(codingResult);
    }

    public void addReview(Long resultId, Integer rating, String feedback, String reviewerId) {
        CodingResult result = getCodingResultById(resultId);
        if (result != null) {
            CodingReview review = new CodingReview();
            review.setResultId(resultId);
            review.setRating(rating);
            review.setFeedback(feedback);
            review.setReviewerId(reviewerId);
            review.setReviewDate(new java.util.Date());
            
            codingReviewRepository.save(review);
        }
    }

    public void deleteCodingResult(Long id) {
        codingResultRepository.deleteById(id);
    }

    public List<CodingReview> getReviewsByResultId(Long resultId) {
        return codingReviewRepository.findByResultId(resultId);
    }
}
