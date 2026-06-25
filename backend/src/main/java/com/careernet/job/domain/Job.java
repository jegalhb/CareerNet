package com.careernet.job.domain;

import com.careernet.common.domain.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "job")
public class Job extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long id;

    @Column(name = "job_code", nullable = false, unique = true, length = 50)
    private String jobCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(columnDefinition = "TEXT")
    private String roadmap;

    @Column(name = "avg_salary", length = 100)
    private String avgSalary;

    @Column(name = "outlook_label", length = 100)
    private String outlookLabel;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<JobHollandCode> hollandCodes = new ArrayList<>();

    protected Job() {
    }

    public Long getId() {
        return id;
    }

    public String getJobCode() {
        return jobCode;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public String getRoadmap() {
        return roadmap;
    }

    public String getAvgSalary() {
        return avgSalary;
    }

    public String getOutlookLabel() {
        return outlookLabel;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public List<JobHollandCode> getHollandCodes() {
        return hollandCodes;
    }

    public String getHollandCodeText() {
        return hollandCodes.stream()
                .sorted(Comparator.comparingInt(JobHollandCode::getSortOrder))
                .map(JobHollandCode::getHollandType)
                .collect(Collectors.joining(" "));
    }
}
