package com.careernet.mentoring.dto;

import com.careernet.mentoring.domain.MentoringRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class MentoringRequestDto {

    public static class CreateRequest {
        @NotNull
        private Long userId;

        @NotNull
        private Long mentorId;

        @NotNull
        private Long jobId;

        @Size(max = 1000)
        private String requestMessage;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getMentorId() {
            return mentorId;
        }

        public void setMentorId(Long mentorId) {
            this.mentorId = mentorId;
        }

        public Long getJobId() {
            return jobId;
        }

        public void setJobId(Long jobId) {
            this.jobId = jobId;
        }

        public String getRequestMessage() {
            return requestMessage;
        }

        public void setRequestMessage(String requestMessage) {
            this.requestMessage = requestMessage;
        }
    }

    public static class Response {
        private final Long mentoringRequestId;
        private final Long userId;
        private final Long mentorId;
        private final String mentorName;
        private final Long jobId;
        private final String jobName;
        private final String requestMessage;
        private final String status;
        private final LocalDateTime createdAt;

        private Response(MentoringRequest mentoringRequest) {
            this.mentoringRequestId = mentoringRequest.getId();
            this.userId = mentoringRequest.getUser().getId();
            this.mentorId = mentoringRequest.getMentor().getId();
            this.mentorName = mentoringRequest.getMentor().getName();
            this.jobId = mentoringRequest.getJob().getId();
            this.jobName = mentoringRequest.getJob().getName();
            this.requestMessage = mentoringRequest.getRequestMessage();
            this.status = mentoringRequest.getStatus().name();
            this.createdAt = mentoringRequest.getCreatedAt();
        }

        public static Response from(MentoringRequest mentoringRequest) {
            return new Response(mentoringRequest);
        }

        public Long getMentoringRequestId() {
            return mentoringRequestId;
        }

        public Long getUserId() {
            return userId;
        }

        public Long getMentorId() {
            return mentorId;
        }

        public String getMentorName() {
            return mentorName;
        }

        public Long getJobId() {
            return jobId;
        }

        public String getJobName() {
            return jobName;
        }

        public String getRequestMessage() {
            return requestMessage;
        }

        public String getStatus() {
            return status;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
