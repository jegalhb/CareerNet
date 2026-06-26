package com.careernet.recruitment.dto;

import com.careernet.recruitment.domain.Recruitment;
import java.time.LocalDate;

public class RecruitmentDto {

    public static class Response {
        private final Long recruitmentId;
        private final String companyName;
        private final String title;
        private final String location;
        private final String employmentType;
        private final String careerLevel;
        private final LocalDate deadlineDate;
        private final String sourceUrl;
        private final String summary;
        private final String description;
        private final Long jobId;
        private final String jobName;
        private final String jobCategory;

        private Response(Recruitment recruitment) {
            this.recruitmentId = recruitment.getId();
            this.companyName = recruitment.getCompanyName();
            this.title = recruitment.getTitle();
            this.location = recruitment.getLocation();
            this.employmentType = recruitment.getEmploymentType();
            this.careerLevel = recruitment.getCareerLevel();
            this.deadlineDate = recruitment.getDeadlineDate();
            this.sourceUrl = recruitment.getSourceUrl();
            this.summary = recruitment.getSummary();
            this.description = recruitment.getDescription();
            this.jobId = recruitment.getJob() == null ? null : recruitment.getJob().getId();
            this.jobName = recruitment.getJob() == null ? null : recruitment.getJob().getName();
            this.jobCategory = recruitment.getJob() == null ? null : recruitment.getJob().getCategory();
        }

        public static Response from(Recruitment recruitment) {
            return new Response(recruitment);
        }

        public Long getRecruitmentId() {
            return recruitmentId;
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

        public Long getJobId() {
            return jobId;
        }

        public String getJobName() {
            return jobName;
        }

        public String getJobCategory() {
            return jobCategory;
        }
    }
}
