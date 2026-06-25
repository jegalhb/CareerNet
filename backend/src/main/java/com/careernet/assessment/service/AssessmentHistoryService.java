package com.careernet.assessment.service;

import com.careernet.assessment.domain.AssessmentRecommendation;
import com.careernet.assessment.domain.AssessmentResult;
import com.careernet.assessment.dto.AssessmentHistoryDto;
import com.careernet.assessment.repository.AssessmentRecommendationRepository;
import com.careernet.assessment.repository.AssessmentResultRepository;
import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.user.repository.AppUserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AssessmentHistoryService {

    private final AssessmentResultRepository assessmentResultRepository;
    private final AssessmentRecommendationRepository assessmentRecommendationRepository;
    private final AppUserRepository appUserRepository;

    public AssessmentHistoryService(
            AssessmentResultRepository assessmentResultRepository,
            AssessmentRecommendationRepository assessmentRecommendationRepository,
            AppUserRepository appUserRepository
    ) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentRecommendationRepository = assessmentRecommendationRepository;
        this.appUserRepository = appUserRepository;
    }

    public List<AssessmentHistoryDto.SummaryResponse> getUserAssessments(Long userId) {
        validateUser(userId);
        return assessmentResultRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AssessmentHistoryDto.SummaryResponse::from)
                .toList();
    }

    public AssessmentHistoryDto.DetailResponse getUserAssessment(Long userId, Long assessmentId) {
        validateUser(userId);
        AssessmentResult assessmentResult = assessmentResultRepository.findByIdAndUser_Id(assessmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment result not found."));
        List<AssessmentRecommendation> recommendations =
                assessmentRecommendationRepository.findByAssessmentResult_IdOrderByRankNoAsc(assessmentId);
        return AssessmentHistoryDto.DetailResponse.of(assessmentResult, recommendations);
    }

    private void validateUser(Long userId) {
        boolean exists = appUserRepository.findById(userId)
                .filter(user -> user.getDeletedAt() == null)
                .isPresent();
        if (!exists) {
            throw new ResourceNotFoundException("User not found.");
        }
    }
}
