package com.careernet.user.dto;

import com.careernet.user.domain.AppUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDto {

    public static class SignupRequest {
        @NotBlank
        @Size(max = 100)
        private String userNm;

        @NotBlank
        @Email
        @Size(max = 255)
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        private String password;

        @Size(max = 50)
        private String education;

        @Size(max = 100)
        private String interest;

        public String getUserNm() {
            return userNm;
        }

        public void setUserNm(String userNm) {
            this.userNm = userNm;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEducation() {
            return education;
        }

        public void setEducation(String education) {
            this.education = education;
        }

        public String getInterest() {
            return interest;
        }

        public void setInterest(String interest) {
            this.interest = interest;
        }
    }

    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class UserResponse {
        private final Long userId;
        private final String userNm;
        private final String email;
        private final String education;
        private final String interest;
        private final String role;

        private UserResponse(AppUser user) {
            this.userId = user.getId();
            this.userNm = user.getName();
            this.email = user.getEmail();
            this.education = user.getEducationLevel();
            this.interest = user.getInterest();
            this.role = user.getRole().name();
        }

        public static UserResponse from(AppUser user) {
            return new UserResponse(user);
        }

        public Long getUserId() {
            return userId;
        }

        public String getUserNm() {
            return userNm;
        }

        public String getEmail() {
            return email;
        }

        public String getEducation() {
            return education;
        }

        public String getInterest() {
            return interest;
        }

        public String getRole() {
            return role;
        }
    }
}
