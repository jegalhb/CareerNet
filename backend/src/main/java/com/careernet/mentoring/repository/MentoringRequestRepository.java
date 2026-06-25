package com.careernet.mentoring.repository;

import com.careernet.mentoring.domain.MentoringRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentoringRequestRepository extends JpaRepository<MentoringRequest, Long> {
}
