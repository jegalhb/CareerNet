package com.careernet.mentor.repository;

import com.careernet.mentor.domain.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
}
