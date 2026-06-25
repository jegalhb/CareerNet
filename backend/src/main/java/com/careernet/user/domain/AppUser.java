package com.careernet.user.domain;

import com.careernet.common.domain.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_user")
public class AppUser extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "education_level", length = 50)
    private String educationLevel;

    @Column(length = 100)
    private String interest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected AppUser() {
    }

    public AppUser(
            String email,
            String passwordHash,
            String name,
            String educationLevel,
            String interest
    ) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.educationLevel = educationLevel;
        this.interest = interest;
        this.role = UserRole.USER;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public String getInterest() {
        return interest;
    }

    public UserRole getRole() {
        return role;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
}
