package com.careernet.mentor.domain;

import com.careernet.common.domain.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mentor")
public class Mentor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_id")
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(length = 255)
    private String headline;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "interview_title", length = 255)
    private String interviewTitle;

    @Column(name = "interview_content", columnDefinition = "TEXT")
    private String interviewContent;

    @Column(name = "career_summary", columnDefinition = "TEXT")
    private String careerSummary;

    @Column(name = "recommendation_count", nullable = false)
    private int recommendationCount;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MentorJob> mentorJobs = new ArrayList<>();

    protected Mentor() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public String getHeadline() {
        return headline;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getInterviewTitle() {
        return interviewTitle;
    }

    public String getInterviewContent() {
        return interviewContent;
    }

    public String getCareerSummary() {
        return careerSummary;
    }

    public int getRecommendationCount() {
        return recommendationCount;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public List<MentorJob> getMentorJobs() {
        return mentorJobs;
    }
}
