package com.careernet.recruitment.repository;

import com.careernet.recruitment.domain.Recruitment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruitmentRepository extends JpaRepository<Recruitment, Long> {

    @EntityGraph(attributePaths = "job")
    List<Recruitment> findByDeletedAtIsNullOrderByDeadlineDateAscIdDesc();

    @EntityGraph(attributePaths = "job")
    List<Recruitment> findTop4ByDeletedAtIsNullOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = "job")
    Optional<Recruitment> findByIdAndDeletedAtIsNull(Long id);
}
