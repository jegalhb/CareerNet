package com.careernet.assessment.repository;

import com.careernet.assessment.domain.AssessmentRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRecommendationRepository extends JpaRepository<AssessmentRecommendation, Long> {
}
