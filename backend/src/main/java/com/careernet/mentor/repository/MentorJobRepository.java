package com.careernet.mentor.repository;

import com.careernet.mentor.domain.MentorJob;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorJobRepository extends JpaRepository<MentorJob, Long> {

    @EntityGraph(attributePaths = {"mentor", "job"})
    List<MentorJob> findByJob_IdAndMentor_ActiveTrueAndMentor_DeletedAtIsNullOrderByPriorityAscRecommendationWeightDesc(Long jobId);

    @EntityGraph(attributePaths = {"mentor", "job"})
    List<MentorJob> findByJob_IdAndMentor_ActiveTrueAndMentor_DeletedAtIsNullOrderByMentor_RecommendationCountDescPriorityAscRecommendationWeightDesc(Long jobId);
}
