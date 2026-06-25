package com.careernet.mentoring.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.mentoring.dto.MentoringRequestDto;
import com.careernet.mentoring.service.MentoringRequestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mentoring-requests")
public class MentoringRequestController {

    private final MentoringRequestService mentoringRequestService;

    public MentoringRequestController(MentoringRequestService mentoringRequestService) {
        this.mentoringRequestService = mentoringRequestService;
    }

    @PostMapping
    public ApiResponse<MentoringRequestDto.Response> createRequest(
            @Valid @RequestBody MentoringRequestDto.CreateRequest request
    ) {
        return ApiResponse.ok("Mentoring request completed.", mentoringRequestService.createRequest(request));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<List<MentoringRequestDto.Response>> getUserRequests(@PathVariable Long userId) {
        return ApiResponse.ok(mentoringRequestService.getUserRequests(userId));
    }
}
