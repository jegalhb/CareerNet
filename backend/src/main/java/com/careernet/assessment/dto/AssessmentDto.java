package com.careernet.assessment.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class AssessmentDto {

    public static class SubmitRequest {
        @NotNull
        private Long userId;

        @NotEmpty
        private Map<Integer, Integer> answers;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Map<Integer, Integer> getAnswers() {
            return answers;
        }

        public void setAnswers(Map<Integer, Integer> answers) {
            this.answers = answers;
        }
    }

    public static class ResultResponse {
        private Long assessId;
        private String hollandCode;
        private String primaryType;
        private Map<String, Integer> rawScores;
        private Map<String, Integer> percentScores;
        private List<TypeRank> rankedTypes;
        private List<JobMatch> recommendations;

        public Long getAssessId() {
            return assessId;
        }

        public void setAssessId(Long assessId) {
            this.assessId = assessId;
        }

        public String getHollandCode() {
            return hollandCode;
        }

        public void setHollandCode(String hollandCode) {
            this.hollandCode = hollandCode;
        }

        public String getPrimaryType() {
            return primaryType;
        }

        public void setPrimaryType(String primaryType) {
            this.primaryType = primaryType;
        }

        public Map<String, Integer> getRawScores() {
            return rawScores;
        }

        public void setRawScores(Map<String, Integer> rawScores) {
            this.rawScores = rawScores;
        }

        public Map<String, Integer> getPercentScores() {
            return percentScores;
        }

        public void setPercentScores(Map<String, Integer> percentScores) {
            this.percentScores = percentScores;
        }

        public List<TypeRank> getRankedTypes() {
            return rankedTypes;
        }

        public void setRankedTypes(List<TypeRank> rankedTypes) {
            this.rankedTypes = rankedTypes;
        }

        public List<JobMatch> getRecommendations() {
            return recommendations;
        }

        public void setRecommendations(List<JobMatch> recommendations) {
            this.recommendations = recommendations;
        }
    }

    public static class TypeRank {
        private final String type;
        private final int score;
        private final int rank;
        private final String name;
        private final String emoji;

        public TypeRank(String type, int score, int rank, String name, String emoji) {
            this.type = type;
            this.score = score;
            this.rank = rank;
            this.name = name;
            this.emoji = emoji;
        }

        public String getType() {
            return type;
        }

        public int getScore() {
            return score;
        }

        public int getRank() {
            return rank;
        }

        public String getName() {
            return name;
        }

        public String getEmoji() {
            return emoji;
        }
    }

    public static class JobMatch {
        private Long jobId;
        private String jobCode;
        private String title;
        private String emoji;
        private String category;
        private int matchScore;
        private String matchLabel;
        private String avgSalary;
        private String outlookLabel;

        public Long getJobId() {
            return jobId;
        }

        public void setJobId(Long jobId) {
            this.jobId = jobId;
        }

        public String getJobCode() {
            return jobCode;
        }

        public void setJobCode(String jobCode) {
            this.jobCode = jobCode;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getEmoji() {
            return emoji;
        }

        public void setEmoji(String emoji) {
            this.emoji = emoji;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public int getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(int matchScore) {
            this.matchScore = matchScore;
        }

        public String getMatchLabel() {
            return matchLabel;
        }

        public void setMatchLabel(String matchLabel) {
            this.matchLabel = matchLabel;
        }

        public String getAvgSalary() {
            return avgSalary;
        }

        public void setAvgSalary(String avgSalary) {
            this.avgSalary = avgSalary;
        }

        public String getOutlookLabel() {
            return outlookLabel;
        }

        public void setOutlookLabel(String outlookLabel) {
            this.outlookLabel = outlookLabel;
        }
    }
}
