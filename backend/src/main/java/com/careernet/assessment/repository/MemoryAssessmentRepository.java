package com.careernet.assessment.repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class MemoryAssessmentRepository implements AssessmentRepository {

    private final AtomicLong sequence = new AtomicLong(1);
    private final List<Map<String, Object>> assessments = new ArrayList<>();
    private final List<Map<String, Object>> answers = new ArrayList<>();
    private final List<Map<String, Object>> recommendations = new ArrayList<>();

    @Override
    public Long saveAssessment(Map<String, Object> assessment) {
        Long assessId = sequence.getAndIncrement();
        Map<String, Object> stored = new LinkedHashMap<>(assessment);
        stored.put("assessId", assessId);
        assessments.add(stored);
        return assessId;
    }

    @Override
    public void saveAnswer(Long assessId, Integer questionId, String questionType, Integer score) {
        Map<String, Object> stored = new LinkedHashMap<>();
        stored.put("assessId", assessId);
        stored.put("questionId", questionId);
        stored.put("questionType", questionType);
        stored.put("score", score);
        answers.add(stored);
    }

    @Override
    public void saveRecommendation(Long assessId, Long userId, String jobId, int matchScore, int rankNo) {
        Map<String, Object> stored = new LinkedHashMap<>();
        stored.put("assessId", assessId);
        stored.put("userId", userId);
        stored.put("jobId", jobId);
        stored.put("matchScore", matchScore);
        stored.put("rankNo", rankNo);
        recommendations.add(stored);
    }
}
