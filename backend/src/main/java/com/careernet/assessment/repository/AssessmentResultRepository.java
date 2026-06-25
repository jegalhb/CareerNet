package com.careernet.assessment.repository;

import com.careernet.assessment.domain.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
}
