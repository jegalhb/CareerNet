package com.careernet.bookmark.repository;

import com.careernet.bookmark.domain.JobBookmark;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobBookmarkRepository extends JpaRepository<JobBookmark, Long> {

    @EntityGraph(attributePaths = {"job", "job.hollandCodes"})
    List<JobBookmark> findByUser_IdOrderByCreatedAtDesc(Long userId);

    Optional<JobBookmark> findByUser_IdAndJob_Id(Long userId, Long jobId);

    boolean existsByUser_IdAndJob_Id(Long userId, Long jobId);
}
