package com.careernet.assessment.service;

import com.careernet.assessment.domain.AssessmentAnswer;
import com.careernet.assessment.domain.AssessmentRecommendation;
import com.careernet.assessment.domain.AssessmentResult;
import com.careernet.assessment.domain.AssessmentType;
import com.careernet.assessment.dto.AssessmentDto;
import com.careernet.assessment.repository.AssessmentAnswerRepository;
import com.careernet.assessment.repository.AssessmentRecommendationRepository;
import com.careernet.assessment.repository.AssessmentResultRepository;
import com.careernet.common.exception.BusinessException;
import com.careernet.job.domain.Job;
import com.careernet.job.repository.JobRepository;
import com.careernet.user.domain.AppUser;
import com.careernet.user.repository.AppUserRepository;
import java.util.ArrayList;
import java.util.Comparator;
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

    private final AssessmentResultRepository assessmentResultRepository;
    private final AssessmentAnswerRepository assessmentAnswerRepository;
    private final AssessmentRecommendationRepository assessmentRecommendationRepository;
    private final JobRepository jobRepository;
    private final AppUserRepository appUserRepository;

    public HollandMatcherService(
            AssessmentResultRepository assessmentResultRepository,
            AssessmentAnswerRepository assessmentAnswerRepository,
            AssessmentRecommendationRepository assessmentRecommendationRepository,
            JobRepository jobRepository,
            AppUserRepository appUserRepository
    ) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentAnswerRepository = assessmentAnswerRepository;
        this.assessmentRecommendationRepository = assessmentRecommendationRepository;
        this.jobRepository = jobRepository;
        this.appUserRepository = appUserRepository;
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
        String hollandCodes = job.getHollandCodeText();
        if (hollandCodes == null || hollandCodes.isBlank()) {
            return 0;
        }

        String[] codes = hollandCodes.trim().split("\\s+");
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
        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new BusinessException("User not found."));
        Map<Integer, Integer> answers = request.getAnswers();

        Map<String, Integer> rawScores = calcRawScores(answers);
        Map<String, Integer> percentScores = calcPercentScores(rawScores);
        List<AssessmentDto.TypeRank> ranked = rankTypes(percentScores);
        String hollandCode = getHollandCode(ranked);
        String primaryType = ranked.isEmpty() ? "" : ranked.get(0).getType();

        List<Job> jobs = jobRepository.findAll().stream()
                .filter(job -> job.getDeletedAt() == null)
                .collect(Collectors.toList());

        List<AssessmentDto.JobMatch> recommendations = jobs.stream()
                .map(job -> toJobMatch(job, percentScores))
                .sorted(Comparator.comparingInt(AssessmentDto.JobMatch::getMatchScore).reversed())
                .limit(8)
                .collect(Collectors.toList());

        AssessmentResult assessmentResult = saveAssessment(user, rawScores, percentScores, hollandCode, primaryType);
        saveAnswers(assessmentResult, answers);
        saveRecommendations(assessmentResult, user, jobs, recommendations);

        AssessmentDto.ResultResponse response = new AssessmentDto.ResultResponse();
        response.setAssessId(assessmentResult.getId());
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
        match.setJobId(job.getId());
        match.setJobCode(job.getJobCode());
        match.setTitle(job.getName());
        match.setEmoji(getJobEmoji(job.getJobCode()));
        match.setCategory(job.getCategory());
        match.setAvgSalary(job.getAvgSalary());
        match.setOutlookLabel(job.getOutlookLabel());

        int matchScore = calcJobMatchScore(job, percentScores);
        match.setMatchScore(matchScore);
        match.setMatchLabel(getMatchLabel(matchScore));
        return match;
    }

    private AssessmentResult saveAssessment(
            AppUser user,
            Map<String, Integer> rawScores,
            Map<String, Integer> percentScores,
            String hollandCode,
            String primaryType
    ) {
        AssessmentResult assessmentResult = new AssessmentResult(
                user,
                AssessmentType.HOLLAND,
                hollandCode,
                primaryType,
                rawScores.get("R"),
                rawScores.get("I"),
                rawScores.get("A"),
                rawScores.get("S"),
                rawScores.get("E"),
                rawScores.get("C"),
                percentScores.get("R"),
                percentScores.get("I"),
                percentScores.get("A"),
                percentScores.get("S"),
                percentScores.get("E"),
                percentScores.get("C")
        );
        return assessmentResultRepository.save(assessmentResult);
    }

    private void saveAnswers(AssessmentResult assessmentResult, Map<Integer, Integer> answers) {
        List<AssessmentAnswer> savedAnswers = answers.entrySet().stream()
                .map(entry -> new AssessmentAnswer(
                        assessmentResult,
                        entry.getKey(),
                        QUESTION_TYPE_MAP.getOrDefault(entry.getKey(), "?"),
                        entry.getValue()
                ))
                .collect(Collectors.toList());
        assessmentAnswerRepository.saveAll(savedAnswers);
    }

    private void saveRecommendations(
            AssessmentResult assessmentResult,
            AppUser user,
            List<Job> jobs,
            List<AssessmentDto.JobMatch> recommendations
    ) {
        Map<Long, Job> jobsById = jobs.stream()
                .collect(Collectors.toMap(Job::getId, job -> job));

        List<AssessmentRecommendation> savedRecommendations = new ArrayList<>();
        for (int i = 0; i < recommendations.size(); i++) {
            AssessmentDto.JobMatch recommendation = recommendations.get(i);
            Job job = jobsById.get(recommendation.getJobId());
            if (job == null) {
                continue;
            }
            savedRecommendations.add(new AssessmentRecommendation(
                    assessmentResult,
                    user,
                    job,
                    recommendation.getMatchScore(),
                    recommendation.getMatchLabel(),
                    i + 1
            ));
        }
        assessmentRecommendationRepository.saveAll(savedRecommendations);
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

    private String getJobEmoji(String jobCode) {
        Map<String, String> emojiMap = Map.of(
                "ai-engineer", "AI",
                "ux-ui-designer", "UX",
                "data-analyst", "DATA",
                "web-developer", "WEB",
                "robotics-engineer", "HW",
                "security-specialist", "SEC",
                "game-developer", "GAME",
                "media-planner", "MEDIA",
                "service-planner", "PM",
                "cloud-engineer", "CLOUD"
        );
        return emojiMap.getOrDefault(jobCode, "JOB");
    }
}
