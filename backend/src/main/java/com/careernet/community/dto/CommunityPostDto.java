package com.careernet.community.dto;

import com.careernet.community.domain.CommunityPost;
import java.time.LocalDateTime;

public class CommunityPostDto {

    public static class Response {
        private final Long postId;
        private final String category;
        private final String title;
        private final String author;
        private final String summary;
        private final String content;
        private final int viewCount;
        private final boolean pinned;
        private final LocalDateTime createdAt;

        private Response(CommunityPost post) {
            this.postId = post.getId();
            this.category = post.getCategory();
            this.title = post.getTitle();
            this.author = post.getAuthor();
            this.summary = post.getSummary();
            this.content = post.getContent();
            this.viewCount = post.getViewCount();
            this.pinned = post.isPinned();
            this.createdAt = post.getCreatedAt();
        }

        public static Response from(CommunityPost post) {
            return new Response(post);
        }

        public Long getPostId() {
            return postId;
        }

        public String getCategory() {
            return category;
        }

        public String getTitle() {
            return title;
        }

        public String getAuthor() {
            return author;
        }

        public String getSummary() {
            return summary;
        }

        public String getContent() {
            return content;
        }

        public int getViewCount() {
            return viewCount;
        }

        public boolean isPinned() {
            return pinned;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
