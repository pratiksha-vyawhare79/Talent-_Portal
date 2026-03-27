package com.codeverge.repository;

import com.codeverge.entity.CodingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodingResultRepository extends JpaRepository<CodingResult, Long> {
}
