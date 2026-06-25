package com.careernet.assessment.controller;

import com.careernet.assessment.dto.AssessmentDto;
import com.careernet.assessment.service.HollandMatcherService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final HollandMatcherService hollandMatcherService;

    public AssessmentController(HollandMatcherService hollandMatcherService) {
        this.hollandMatcherService = hollandMatcherService;
    }

    @PostMapping("/holland")
    public AssessmentDto.ResultResponse submitHollandAssessment(
            @RequestBody AssessmentDto.SubmitRequest request
    ) {
        return hollandMatcherService.processAssessment(request);
    }
}
