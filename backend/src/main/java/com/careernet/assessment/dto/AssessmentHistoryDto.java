package com.careernet.assessment.dto;

import com.careernet.assessment.domain.AssessmentRecommendation;
import com.careernet.assessment.domain.AssessmentResult;
import com.careernet.job.dto.JobDto;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class AssessmentHistoryDto {

    public static class SummaryResponse {
        private final Long assessmentId;
        private final String assessmentType;
        private final String hollandCode;
        private final String primaryType;
        private final Map<String, Integer> rawScores;
        private final Map<String, Integer> percentScores;
        private final LocalDateTime createdAt;

        protected SummaryResponse(AssessmentResult assessmentResult) {
            this.assessmentId = assessmentResult.getId();
            this.assessmentType = assessmentResult.getAssessmentType().name();
            this.hollandCode = assessmentResult.getHollandCode();
            this.primaryType = assessmentResult.getPrimaryType();
            this.rawScores = toRawScores(assessmentResult);
            this.percentScores = toPercentScores(assessmentResult);
            this.createdAt = assessmentResult.getCreatedAt();
        }

        public static SummaryResponse from(AssessmentResult assessmentResult) {
            return new SummaryResponse(assessmentResult);
        }

        public Long getAssessmentId() {
            return assessmentId;
        }

        public String getAssessmentType() {
            return assessmentType;
        }

        public String getHollandCode() {
            return hollandCode;
        }

        public String getPrimaryType() {
            return primaryType;
        }

        public Map<String, Integer> getRawScores() {
            return rawScores;
        }

        public Map<String, Integer> getPercentScores() {
            return percentScores;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }

    public static class DetailResponse extends SummaryResponse {
        private final List<RecommendationResponse> recommendations;

        private DetailResponse(
                AssessmentResult assessmentResult,
                List<AssessmentRecommendation> recommendations
        ) {
            super(assessmentResult);
            this.recommendations = recommendations.stream()
                    .map(RecommendationResponse::from)
                    .toList();
        }

        public static DetailResponse of(
                AssessmentResult assessmentResult,
                List<AssessmentRecommendation> recommendations
        ) {
            return new DetailResponse(assessmentResult, recommendations);
        }

        public List<RecommendationResponse> getRecommendations() {
            return recommendations;
        }
    }

    public static class RecommendationResponse {
        private final Long recommendationId;
        private final int rankNo;
        private final int matchScore;
        private final String matchLabel;
        private final JobDto.SummaryResponse job;

        private RecommendationResponse(AssessmentRecommendation recommendation) {
            this.recommendationId = recommendation.getId();
            this.rankNo = recommendation.getRankNo();
            this.matchScore = recommendation.getMatchScore();
            this.matchLabel = recommendation.getMatchLabel();
            this.job = JobDto.SummaryResponse.from(recommendation.getJob());
        }

        public static RecommendationResponse from(AssessmentRecommendation recommendation) {
            return new RecommendationResponse(recommendation);
        }

        public Long getRecommendationId() {
            return recommendationId;
        }

        public int getRankNo() {
            return rankNo;
        }

        public int getMatchScore() {
            return matchScore;
        }

        public String getMatchLabel() {
            return matchLabel;
        }

        public JobDto.SummaryResponse getJob() {
            return job;
        }
    }

    private static Map<String, Integer> toRawScores(AssessmentResult assessmentResult) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("R", assessmentResult.getScoreR());
        scores.put("I", assessmentResult.getScoreI());
        scores.put("A", assessmentResult.getScoreA());
        scores.put("S", assessmentResult.getScoreS());
        scores.put("E", assessmentResult.getScoreE());
        scores.put("C", assessmentResult.getScoreC());
        return scores;
    }

    private static Map<String, Integer> toPercentScores(AssessmentResult assessmentResult) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("R", assessmentResult.getPctR());
        scores.put("I", assessmentResult.getPctI());
        scores.put("A", assessmentResult.getPctA());
        scores.put("S", assessmentResult.getPctS());
        scores.put("E", assessmentResult.getPctE());
        scores.put("C", assessmentResult.getPctC());
        return scores;
    }
}
