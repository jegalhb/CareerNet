package com.careernet.community.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.community.dto.CommunityPostDto;
import com.careernet.community.service.CommunityPostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/community/posts")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    public CommunityPostController(CommunityPostService communityPostService) {
        this.communityPostService = communityPostService;
    }

    @GetMapping
    public ApiResponse<List<CommunityPostDto.Response>> getPosts(
            @RequestParam(defaultValue = "false") boolean latest
    ) {
        if (latest) {
            return ApiResponse.ok(communityPostService.getLatestPosts());
        }
        return ApiResponse.ok(communityPostService.getPosts());
    }

    @GetMapping("/{postId}")
    public ApiResponse<CommunityPostDto.Response> getPost(@PathVariable Long postId) {
        return ApiResponse.ok(communityPostService.getPost(postId));
    }
}
