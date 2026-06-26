package com.careernet.community.repository;

import com.careernet.community.domain.CommunityPost;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findByDeletedAtIsNullOrderByPinnedDescCreatedAtDesc();

    List<CommunityPost> findTop5ByDeletedAtIsNullOrderByPinnedDescCreatedAtDesc();

    Optional<CommunityPost> findByIdAndDeletedAtIsNull(Long id);
}
