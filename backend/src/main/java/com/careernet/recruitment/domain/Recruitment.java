package com.careernet.recruitment.domain;

import com.careernet.common.domain.BaseTimeEntity;
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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recruitment")
public class Recruitment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recruitment_id")
    private Long id;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 100)
    private String location;

    @Column(name = "employment_type", length = 60)
    private String employmentType;

    @Column(name = "career_level", length = 60)
    private String careerLevel;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected Recruitment() {
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public String getCareerLevel() {
        return careerLevel;
    }

    public LocalDate getDeadlineDate() {
        return deadlineDate;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public Job getJob() {
        return job;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
}
