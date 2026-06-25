package com.careernet.mentor.domain;

import com.careernet.job.domain.Job;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;

@Entity
@Table(
        name = "mentor_job",
        uniqueConstraints = @UniqueConstraint(name = "uq_mentor_job", columnNames = {"mentor_id", "job_id"})
)
public class MentorJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_job_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Mentor mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private int priority = 1;

    @Column(name = "recommendation_weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal recommendationWeight = BigDecimal.ONE;

    protected MentorJob() {
    }
}
