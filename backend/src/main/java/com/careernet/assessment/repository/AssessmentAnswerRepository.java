package com.careernet.assessment.repository;

import com.careernet.assessment.domain.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Long> {
}
