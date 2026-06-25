package com.careernet.assessment.repository;

import com.careernet.assessment.domain.AssessmentResult;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {

    @EntityGraph(attributePaths = "user")
    List<AssessmentResult> findByUser_IdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = "user")
    Optional<AssessmentResult> findByIdAndUser_Id(Long id, Long userId);
}
