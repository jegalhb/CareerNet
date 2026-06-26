package com.careernet.bookmark.controller;

import com.careernet.bookmark.dto.JobBookmarkDto;
import com.careernet.bookmark.service.JobBookmarkService;
import com.careernet.common.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
public class JobBookmarkController {

    private final JobBookmarkService jobBookmarkService;

    public JobBookmarkController(JobBookmarkService jobBookmarkService) {
        this.jobBookmarkService = jobBookmarkService;
    }

    @GetMapping("/users/{userId}/jobs")
    public ApiResponse<List<JobBookmarkDto.Response>> getUserBookmarks(@PathVariable Long userId) {
        return ApiResponse.ok(jobBookmarkService.getUserBookmarks(userId));
    }

    @GetMapping("/jobs/{jobId}")
    public ApiResponse<Map<String, Boolean>> existsBookmark(
            @PathVariable Long jobId,
            @RequestParam Long userId
    ) {
        return ApiResponse.ok(Map.of("bookmarked", jobBookmarkService.existsBookmark(userId, jobId)));
    }

    @PostMapping("/jobs")
    public ApiResponse<JobBookmarkDto.Response> createBookmark(
            @Valid @RequestBody JobBookmarkDto.CreateRequest request
    ) {
        return ApiResponse.ok(jobBookmarkService.createBookmark(request.getUserId(), request.getJobId()));
    }

    @DeleteMapping("/users/{userId}/jobs/{jobId}")
    public ApiResponse<Void> deleteBookmark(@PathVariable Long userId, @PathVariable Long jobId) {
        jobBookmarkService.deleteBookmark(userId, jobId);
        return ApiResponse.ok(null);
    }
}
