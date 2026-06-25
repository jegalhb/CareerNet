package com.careernet.mentor.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.mentor.dto.MentorDto;
import com.careernet.mentor.service.MentorService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping
    public ApiResponse<List<MentorDto.CardResponse>> getMentors(
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.ok(mentorService.getMentors(keyword));
    }

    @GetMapping("/{mentorId}")
    public ApiResponse<MentorDto.DetailResponse> getMentor(@PathVariable Long mentorId) {
        return ApiResponse.ok(mentorService.getMentor(mentorId));
    }
}
