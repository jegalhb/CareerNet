package com.careernet.recruitment.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.recruitment.dto.RecruitmentDto;
import com.careernet.recruitment.service.RecruitmentService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruitments")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    public RecruitmentController(RecruitmentService recruitmentService) {
        this.recruitmentService = recruitmentService;
    }

    @GetMapping
    public ApiResponse<List<RecruitmentDto.Response>> getRecruitments(
            @RequestParam(defaultValue = "false") boolean latest
    ) {
        if (latest) {
            return ApiResponse.ok(recruitmentService.getLatestRecruitments());
        }
        return ApiResponse.ok(recruitmentService.getRecruitments());
    }

    @GetMapping("/{recruitmentId}")
    public ApiResponse<RecruitmentDto.Response> getRecruitment(@PathVariable Long recruitmentId) {
        return ApiResponse.ok(recruitmentService.getRecruitment(recruitmentId));
    }
}
