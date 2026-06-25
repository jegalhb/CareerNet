package com.careernet.mentor.repository;

import com.careernet.mentor.domain.Mentor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {

    @EntityGraph(attributePaths = {"mentorJobs", "mentorJobs.job"})
    List<Mentor> findByActiveTrueAndDeletedAtIsNullOrderByRecommendationCountDesc();

    @EntityGraph(attributePaths = {"mentorJobs", "mentorJobs.job"})
    Optional<Mentor> findByIdAndActiveTrueAndDeletedAtIsNull(Long id);
}
