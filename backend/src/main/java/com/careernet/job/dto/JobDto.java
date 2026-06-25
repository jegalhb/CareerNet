package com.careernet.job.dto;

import com.careernet.job.domain.Job;
import com.careernet.mentor.dto.MentorDto;
import java.util.List;

public class JobDto {

    public static class SummaryResponse {
        private final Long jobId;
        private final String jobCode;
        private final String name;
        private final String category;
        private final String summary;
        private final String avgSalary;
        private final String outlookLabel;
        private final List<String> hollandTypes;

        private SummaryResponse(Job job) {
            this.jobId = job.getId();
            this.jobCode = job.getJobCode();
            this.name = job.getName();
            this.category = job.getCategory();
            this.summary = job.getSummary();
            this.avgSalary = job.getAvgSalary();
            this.outlookLabel = job.getOutlookLabel();
            this.hollandTypes = job.getHollandCodes().stream()
                    .map(code -> code.getHollandType())
                    .toList();
        }

        public static SummaryResponse from(Job job) {
            return new SummaryResponse(job);
        }

        public Long getJobId() {
            return jobId;
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

        public String getAvgSalary() {
            return avgSalary;
        }

        public String getOutlookLabel() {
            return outlookLabel;
        }

        public List<String> getHollandTypes() {
            return hollandTypes;
        }
    }

    public static class DetailResponse {
        private final Long jobId;
        private final String jobCode;
        private final String name;
        private final String category;
        private final String summary;
        private final String description;
        private final String requiredSkills;
        private final String roadmap;
        private final String avgSalary;
        private final String outlookLabel;
        private final List<String> hollandTypes;
        private final List<MentorDto.CardResponse> relatedMentors;

        private DetailResponse(Job job, List<MentorDto.CardResponse> relatedMentors) {
            this.jobId = job.getId();
            this.jobCode = job.getJobCode();
            this.name = job.getName();
            this.category = job.getCategory();
            this.summary = job.getSummary();
            this.description = job.getDescription();
            this.requiredSkills = job.getRequiredSkills();
            this.roadmap = job.getRoadmap();
            this.avgSalary = job.getAvgSalary();
            this.outlookLabel = job.getOutlookLabel();
            this.hollandTypes = job.getHollandCodes().stream()
                    .map(code -> code.getHollandType())
                    .toList();
            this.relatedMentors = relatedMentors;
        }

        public static DetailResponse of(Job job, List<MentorDto.CardResponse> relatedMentors) {
            return new DetailResponse(job, relatedMentors);
        }

        public Long getJobId() {
            return jobId;
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

        public List<String> getHollandTypes() {
            return hollandTypes;
        }

        public List<MentorDto.CardResponse> getRelatedMentors() {
            return relatedMentors;
        }
    }
}
