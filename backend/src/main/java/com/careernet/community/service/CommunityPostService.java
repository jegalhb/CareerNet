package com.careernet.community.service;

import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.community.dto.CommunityPostDto;
import com.careernet.community.repository.CommunityPostRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;

    public CommunityPostService(CommunityPostRepository communityPostRepository) {
        this.communityPostRepository = communityPostRepository;
    }

    public List<CommunityPostDto.Response> getPosts() {
        return communityPostRepository.findByDeletedAtIsNullOrderByPinnedDescCreatedAtDesc()
                .stream()
                .map(CommunityPostDto.Response::from)
                .toList();
    }

    public List<CommunityPostDto.Response> getLatestPosts() {
        return communityPostRepository.findTop5ByDeletedAtIsNullOrderByPinnedDescCreatedAtDesc()
                .stream()
                .map(CommunityPostDto.Response::from)
                .toList();
    }

    public CommunityPostDto.Response getPost(Long postId) {
        return communityPostRepository.findByIdAndDeletedAtIsNull(postId)
                .map(CommunityPostDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found."));
    }
}
