package com.careernet.mentor.repository;

import com.careernet.mentor.domain.MentorJob;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorJobRepository extends JpaRepository<MentorJob, Long> {

    List<MentorJob> findByJob_IdOrderByPriorityAscRecommendationWeightDesc(Long jobId);
}
