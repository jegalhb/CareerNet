package com.careernet.job.repository;

import com.careernet.job.domain.Job;
import java.util.List;

public interface JobRepository {

    List<Job> findAll();
}
