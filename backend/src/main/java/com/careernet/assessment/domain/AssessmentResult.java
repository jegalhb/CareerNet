package com.careernet.assessment.domain;

import com.careernet.user.domain.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_result")
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(name = "assessment_type", nullable = false, length = 30)
    private AssessmentType assessmentType;

    @Column(name = "holland_code", length = 10)
    private String hollandCode;

    @Column(name = "primary_type", length = 10)
    private String primaryType;

    @Column(name = "score_r")
    private int scoreR;

    @Column(name = "score_i")
    private int scoreI;

    @Column(name = "score_a")
    private int scoreA;

    @Column(name = "score_s")
    private int scoreS;

    @Column(name = "score_e")
    private int scoreE;

    @Column(name = "score_c")
    private int scoreC;

    @Column(name = "pct_r")
    private int pctR;

    @Column(name = "pct_i")
    private int pctI;

    @Column(name = "pct_a")
    private int pctA;

    @Column(name = "pct_s")
    private int pctS;

    @Column(name = "pct_e")
    private int pctE;

    @Column(name = "pct_c")
    private int pctC;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected AssessmentResult() {
    }

    public AssessmentResult(
            AppUser user,
            AssessmentType assessmentType,
            String hollandCode,
            String primaryType,
            int scoreR,
            int scoreI,
            int scoreA,
            int scoreS,
            int scoreE,
            int scoreC,
            int pctR,
            int pctI,
            int pctA,
            int pctS,
            int pctE,
            int pctC
    ) {
        this.user = user;
        this.assessmentType = assessmentType;
        this.hollandCode = hollandCode;
        this.primaryType = primaryType;
        this.scoreR = scoreR;
        this.scoreI = scoreI;
        this.scoreA = scoreA;
        this.scoreS = scoreS;
        this.scoreE = scoreE;
        this.scoreC = scoreC;
        this.pctR = pctR;
        this.pctI = pctI;
        this.pctA = pctA;
        this.pctS = pctS;
        this.pctE = pctE;
        this.pctC = pctC;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }
}
