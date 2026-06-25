package com.careernet.job.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.job.dto.JobDto;
import com.careernet.job.service.JobService;
import com.careernet.mentor.dto.MentorDto;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ApiResponse<List<JobDto.SummaryResponse>> getJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.ok(jobService.getJobs(category, keyword));
    }

    @GetMapping("/{jobId}")
    public ApiResponse<JobDto.DetailResponse> getJob(@PathVariable Long jobId) {
        return ApiResponse.ok(jobService.getJob(jobId));
    }

    @GetMapping("/{jobId}/mentors")
    public ApiResponse<List<MentorDto.CardResponse>> getJobMentors(@PathVariable Long jobId) {
        return ApiResponse.ok(jobService.getJobMentors(jobId));
    }

    @GetMapping("/{jobId}/mentors/top")
    public ApiResponse<MentorDto.CardResponse> getTopMentor(@PathVariable Long jobId) {
        return ApiResponse.ok(jobService.getTopMentor(jobId));
    }
}
