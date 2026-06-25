package com.careernet.mentoring.repository;

import com.careernet.mentoring.domain.MentoringRequest;
import com.careernet.mentoring.domain.MentoringRequestStatus;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentoringRequestRepository extends JpaRepository<MentoringRequest, Long> {

    boolean existsByUser_IdAndMentor_IdAndJob_IdAndStatus(
            Long userId,
            Long mentorId,
            Long jobId,
            MentoringRequestStatus status
    );

    @EntityGraph(attributePaths = {"user", "mentor", "job"})
    List<MentoringRequest> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
