package com.careernet.assessment.repository;

import com.careernet.assessment.domain.AssessmentRecommendation;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRecommendationRepository extends JpaRepository<AssessmentRecommendation, Long> {

    @EntityGraph(attributePaths = {"job", "job.hollandCodes"})
    List<AssessmentRecommendation> findByAssessmentResult_IdOrderByRankNoAsc(Long assessmentResultId);
}
