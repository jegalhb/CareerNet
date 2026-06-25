package com.careernet.assessment.repository;

import java.util.Map;

public interface AssessmentRepository {

    Long saveAssessment(Map<String, Object> assessment);

    void saveAnswer(Long assessId, Integer questionId, String questionType, Integer score);

    void saveRecommendation(Long assessId, Long userId, String jobId, int matchScore, int rankNo);
}
