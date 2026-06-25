package com.careernet.job.repository;

import com.careernet.job.domain.Job;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Override
    @EntityGraph(attributePaths = "hollandCodes")
    List<Job> findAll();
}
