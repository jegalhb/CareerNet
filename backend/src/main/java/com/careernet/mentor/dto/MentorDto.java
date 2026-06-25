package com.careernet.mentor.dto;

import com.careernet.job.dto.JobDto;
import com.careernet.mentor.domain.Mentor;
import com.careernet.mentor.domain.MentorJob;
import java.math.BigDecimal;
import java.util.List;

public class MentorDto {

    public static class CardResponse {
        private final Long mentorId;
        private final String name;
        private final String jobTitle;
        private final String companyName;
        private final String profileImageUrl;
        private final String headline;
        private final String shortDescription;
        private final int recommendationCount;
        private final Integer priority;
        private final BigDecimal recommendationWeight;

        private CardResponse(
                Mentor mentor,
                Integer priority,
                BigDecimal recommendationWeight
        ) {
            this.mentorId = mentor.getId();
            this.name = mentor.getName();
            this.jobTitle = mentor.getJobTitle();
            this.companyName = mentor.getCompanyName();
            this.profileImageUrl = mentor.getProfileImageUrl();
            this.headline = mentor.getHeadline();
            this.shortDescription = mentor.getShortDescription();
            this.recommendationCount = mentor.getRecommendationCount();
            this.priority = priority;
            this.recommendationWeight = recommendationWeight;
        }

        public static CardResponse from(Mentor mentor) {
            return new CardResponse(mentor, null, null);
        }

        public static CardResponse from(MentorJob mentorJob) {
            return new CardResponse(
                    mentorJob.getMentor(),
                    mentorJob.getPriority(),
                    mentorJob.getRecommendationWeight()
            );
        }

        public Long getMentorId() {
            return mentorId;
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

        public int getRecommendationCount() {
            return recommendationCount;
        }

        public Integer getPriority() {
            return priority;
        }

        public BigDecimal getRecommendationWeight() {
            return recommendationWeight;
        }
    }

    public static class DetailResponse {
        private final Long mentorId;
        private final String name;
        private final String jobTitle;
        private final String companyName;
        private final String profileImageUrl;
        private final String headline;
        private final String shortDescription;
        private final String interviewTitle;
        private final String interviewContent;
        private final String careerSummary;
        private final int recommendationCount;
        private final List<JobDto.SummaryResponse> relatedJobs;

        private DetailResponse(Mentor mentor) {
            this.mentorId = mentor.getId();
            this.name = mentor.getName();
            this.jobTitle = mentor.getJobTitle();
            this.companyName = mentor.getCompanyName();
            this.profileImageUrl = mentor.getProfileImageUrl();
            this.headline = mentor.getHeadline();
            this.shortDescription = mentor.getShortDescription();
            this.interviewTitle = mentor.getInterviewTitle();
            this.interviewContent = mentor.getInterviewContent();
            this.careerSummary = mentor.getCareerSummary();
            this.recommendationCount = mentor.getRecommendationCount();
            this.relatedJobs = mentor.getMentorJobs().stream()
                    .map(MentorJob::getJob)
                    .filter(job -> job.getDeletedAt() == null)
                    .map(JobDto.SummaryResponse::from)
                    .toList();
        }

        public static DetailResponse from(Mentor mentor) {
            return new DetailResponse(mentor);
        }

        public Long getMentorId() {
            return mentorId;
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

        public List<JobDto.SummaryResponse> getRelatedJobs() {
            return relatedJobs;
        }
    }
}
