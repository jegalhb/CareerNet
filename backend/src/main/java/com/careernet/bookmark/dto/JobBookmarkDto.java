package com.careernet.bookmark.dto;

import com.careernet.bookmark.domain.JobBookmark;
import com.careernet.job.dto.JobDto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class JobBookmarkDto {

    public static class CreateRequest {
        @NotNull
        private Long userId;

        @NotNull
        private Long jobId;

        public Long getUserId() {
            return userId;
        }

        public Long getJobId() {
            return jobId;
        }
    }

    public static class Response {
        private final Long bookmarkId;
        private final LocalDateTime createdAt;
        private final JobDto.SummaryResponse job;

        private Response(JobBookmark bookmark) {
            this.bookmarkId = bookmark.getId();
            this.createdAt = bookmark.getCreatedAt();
            this.job = JobDto.SummaryResponse.from(bookmark.getJob());
        }

        public static Response from(JobBookmark bookmark) {
            return new Response(bookmark);
        }

        public Long getBookmarkId() {
            return bookmarkId;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public JobDto.SummaryResponse getJob() {
            return job;
        }
    }
}
