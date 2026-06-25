package com.careernet.assessment.controller;

import com.careernet.assessment.dto.AssessmentHistoryDto;
import com.careernet.assessment.dto.AssessmentDto;
import com.careernet.assessment.service.AssessmentHistoryService;
import com.careernet.assessment.service.HollandMatcherService;
import com.careernet.common.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final HollandMatcherService hollandMatcherService;
    private final AssessmentHistoryService assessmentHistoryService;

    public AssessmentController(
            HollandMatcherService hollandMatcherService,
            AssessmentHistoryService assessmentHistoryService
    ) {
        this.hollandMatcherService = hollandMatcherService;
        this.assessmentHistoryService = assessmentHistoryService;
    }

    @PostMapping("/holland")
    public ApiResponse<AssessmentDto.ResultResponse> submitHollandAssessment(
            @Valid @RequestBody AssessmentDto.SubmitRequest request
    ) {
        return ApiResponse.ok(hollandMatcherService.processAssessment(request));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<List<AssessmentHistoryDto.SummaryResponse>> getUserAssessments(
            @PathVariable Long userId
    ) {
        return ApiResponse.ok(assessmentHistoryService.getUserAssessments(userId));
    }

    @GetMapping("/users/{userId}/{assessmentId}")
    public ApiResponse<AssessmentHistoryDto.DetailResponse> getUserAssessment(
            @PathVariable Long userId,
            @PathVariable Long assessmentId
    ) {
        return ApiResponse.ok(assessmentHistoryService.getUserAssessment(userId, assessmentId));
    }
}
