package com.careernet.assessment.domain;

import com.careernet.job.domain.Job;
import com.careernet.user.domain.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_recommendation")
public class AssessmentRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private AssessmentResult assessmentResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "match_score", nullable = false)
    private int matchScore;

    @Column(name = "match_label", length = 50)
    private String matchLabel;

    @Column(name = "rank_no", nullable = false)
    private int rankNo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected AssessmentRecommendation() {
    }

    public AssessmentRecommendation(
            AssessmentResult assessmentResult,
            AppUser user,
            Job job,
            int matchScore,
            String matchLabel,
            int rankNo
    ) {
        this.assessmentResult = assessmentResult;
        this.user = user;
        this.job = job;
        this.matchScore = matchScore;
        this.matchLabel = matchLabel;
        this.rankNo = rankNo;
        this.createdAt = LocalDateTime.now();
    }
}
