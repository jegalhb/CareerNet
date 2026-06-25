package com.careernet.job.repository;

import com.careernet.job.domain.Job;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Override
    @EntityGraph(attributePaths = "hollandCodes")
    List<Job> findAll();

    @EntityGraph(attributePaths = "hollandCodes")
    List<Job> findByDeletedAtIsNullOrderByNameAsc();

    @EntityGraph(attributePaths = "hollandCodes")
    List<Job> findByCategoryAndDeletedAtIsNullOrderByNameAsc(String category);

    @EntityGraph(attributePaths = "hollandCodes")
    Optional<Job> findByIdAndDeletedAtIsNull(Long id);
}
