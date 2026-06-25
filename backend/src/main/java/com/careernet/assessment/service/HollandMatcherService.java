package com.careernet.assessment.service;

import com.careernet.assessment.dto.AssessmentDto;
import com.careernet.assessment.repository.AssessmentRepository;
import com.careernet.job.domain.Job;
import com.careernet.job.repository.JobRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HollandMatcherService {

    private static final Map<Integer, String> QUESTION_TYPE_MAP = new LinkedHashMap<>();
    private static final Map<String, String[]> TYPE_INFO = new LinkedHashMap<>();

    static {
        String[] types = {"R", "I", "A", "S", "E", "C"};
        for (int i = 0; i < types.length; i++) {
            for (int q = 1; q <= 4; q++) {
                QUESTION_TYPE_MAP.put(i * 4 + q, types[i]);
            }
        }

        TYPE_INFO.put("R", new String[]{"실재형", "R"});
        TYPE_INFO.put("I", new String[]{"탐구형", "I"});
        TYPE_INFO.put("A", new String[]{"예술형", "A"});
        TYPE_INFO.put("S", new String[]{"사회형", "S"});
        TYPE_INFO.put("E", new String[]{"진취형", "E"});
        TYPE_INFO.put("C", new String[]{"관습형", "C"});
    }

    private final AssessmentRepository assessmentRepository;
    private final JobRepository jobRepository;

    public HollandMatcherService(
            AssessmentRepository assessmentRepository,
            JobRepository jobRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.jobRepository = jobRepository;
    }

    public Map<String, Integer> calcRawScores(Map<Integer, Integer> answers) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        for (String type : TYPE_INFO.keySet()) {
            scores.put(type, 0);
        }

        if (answers == null) {
            return scores;
        }

        answers.forEach((questionId, score) -> {
            String type = QUESTION_TYPE_MAP.get(questionId);
            if (type != null && score != null && score >= 1 && score <= 5) {
                scores.merge(type, score, Integer::sum);
            }
        });
        return scores;
    }

    public Map<String, Integer> calcPercentScores(Map<String, Integer> rawScores) {
        final int maxPerType = 20;
        Map<String, Integer> percentScores = new LinkedHashMap<>();
        rawScores.forEach((type, raw) ->
                percentScores.put(type, Math.round((float) raw / maxPerType * 100))
        );
        return percentScores;
    }

    public List<AssessmentDto.TypeRank> rankTypes(Map<String, Integer> percentScores) {
        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(percentScores.entrySet());
        sorted.sort((left, right) -> right.getValue() - left.getValue());

        List<AssessmentDto.TypeRank> ranked = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            String type = sorted.get(i).getKey();
            int score = sorted.get(i).getValue();
            String[] info = TYPE_INFO.get(type);
            ranked.add(new AssessmentDto.TypeRank(type, score, i + 1, info[0], info[1]));
        }
        return ranked;
    }

    public String getHollandCode(List<AssessmentDto.TypeRank> rankedTypes) {
        return rankedTypes.stream()
                .limit(3)
                .map(AssessmentDto.TypeRank::getType)
                .collect(Collectors.joining());
    }

    public int calcJobMatchScore(Job job, Map<String, Integer> percentScores) {
        if (job.getHollandCodes() == null || job.getHollandCodes().isBlank()) {
            return 0;
        }

        String[] codes = job.getHollandCodes().trim().split("\\s+");
        double[] weights = {0.5, 0.3, 0.2};
        double score = 0;

        for (int i = 0; i < codes.length; i++) {
            double weight = i < weights.length ? weights[i] : 0.1;
            score += percentScores.getOrDefault(codes[i], 0) * weight;
        }
        return (int) Math.round(score);
    }

    @Transactional
    public AssessmentDto.ResultResponse processAssessment(AssessmentDto.SubmitRequest request) {
        Map<Integer, Integer> answers = request.getAnswers();

        Map<String, Integer> rawScores = calcRawScores(answers);
        Map<String, Integer> percentScores = calcPercentScores(rawScores);
        List<AssessmentDto.TypeRank> ranked = rankTypes(percentScores);
        String hollandCode = getHollandCode(ranked);
        String primaryType = ranked.isEmpty() ? "" : ranked.get(0).getType();

        List<AssessmentDto.JobMatch> recommendations = jobRepository.findAll().stream()
                .map(job -> toJobMatch(job, percentScores))
                .sorted(Comparator.comparingInt(AssessmentDto.JobMatch::getMatchScore).reversed())
                .limit(8)
                .collect(Collectors.toList());

        Long assessId = saveAssessment(request, rawScores, percentScores, hollandCode, primaryType);
        saveAnswers(assessId, answers);
        saveRecommendations(assessId, request.getUserId(), recommendations);

        AssessmentDto.ResultResponse response = new AssessmentDto.ResultResponse();
        response.setAssessId(assessId);
        response.setHollandCode(hollandCode);
        response.setPrimaryType(primaryType);
        response.setRawScores(rawScores);
        response.setPercentScores(percentScores);
        response.setRankedTypes(ranked);
        response.setRecommendations(recommendations);
        return response;
    }

    private AssessmentDto.JobMatch toJobMatch(Job job, Map<String, Integer> percentScores) {
        AssessmentDto.JobMatch match = new AssessmentDto.JobMatch();
        match.setJobId(job.getJobId());
        match.setTitle(job.getJobName());
        match.setEmoji(getJobEmoji(job.getJobId()));
        match.setCategory(job.getCategory());
        match.setAvgSalary(job.getAvgSalary());
        match.setOutlookLabel(job.getOutlookLabel());

        int matchScore = calcJobMatchScore(job, percentScores);
        match.setMatchScore(matchScore);
        match.setMatchLabel(getMatchLabel(matchScore));
        return match;
    }

    private Long saveAssessment(
            AssessmentDto.SubmitRequest request,
            Map<String, Integer> rawScores,
            Map<String, Integer> percentScores,
            String hollandCode,
            String primaryType
    ) {
        Map<String, Object> assessment = new HashMap<>();
        assessment.put("userId", request.getUserId());
        assessment.put("scoreR", rawScores.get("R"));
        assessment.put("scoreI", rawScores.get("I"));
        assessment.put("scoreA", rawScores.get("A"));
        assessment.put("scoreS", rawScores.get("S"));
        assessment.put("scoreE", rawScores.get("E"));
        assessment.put("scoreC", rawScores.get("C"));
        assessment.put("pctR", percentScores.get("R"));
        assessment.put("pctI", percentScores.get("I"));
        assessment.put("pctA", percentScores.get("A"));
        assessment.put("pctS", percentScores.get("S"));
        assessment.put("pctE", percentScores.get("E"));
        assessment.put("pctC", percentScores.get("C"));
        assessment.put("hollandCode", hollandCode);
        assessment.put("primaryType", primaryType);
        return assessmentRepository.saveAssessment(assessment);
    }

    private void saveAnswers(Long assessId, Map<Integer, Integer> answers) {
        if (answers == null) {
            return;
        }

        answers.forEach((questionId, score) ->
                assessmentRepository.saveAnswer(
                        assessId,
                        questionId,
                        QUESTION_TYPE_MAP.getOrDefault(questionId, "?"),
                        score
                )
        );
    }

    private void saveRecommendations(
            Long assessId,
            Long userId,
            List<AssessmentDto.JobMatch> recommendations
    ) {
        for (int i = 0; i < recommendations.size(); i++) {
            AssessmentDto.JobMatch recommendation = recommendations.get(i);
            assessmentRepository.saveRecommendation(
                    assessId,
                    userId,
                    recommendation.getJobId(),
                    recommendation.getMatchScore(),
                    i + 1
            );
        }
    }

    private String getMatchLabel(int score) {
        if (score >= 80) {
            return "매우 적합";
        }
        if (score >= 65) {
            return "적합";
        }
        if (score >= 50) {
            return "보통";
        }
        return "참고용";
    }

    private String getJobEmoji(String jobId) {
        Map<String, String> emojiMap = Map.of(
                "job_001", "AI",
                "job_002", "UX",
                "job_003", "DATA",
                "job_004", "WEB",
                "job_005", "HW",
                "job_006", "SEC",
                "job_007", "GAME",
                "job_008", "MEDIA",
                "job_009", "PM",
                "job_010", "CLOUD"
        );
        return emojiMap.getOrDefault(jobId, "JOB");
    }
}
