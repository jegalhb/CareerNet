package com.careernet.bookmark.domain;

import com.careernet.common.domain.BaseTimeEntity;
import com.careernet.job.domain.Job;
import com.careernet.user.domain.AppUser;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "job_bookmark",
        uniqueConstraints = @UniqueConstraint(name = "uq_job_bookmark_user_job", columnNames = {"user_id", "job_id"})
)
public class JobBookmark extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @jakarta.persistence.Column(name = "bookmark_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    protected JobBookmark() {
    }

    public JobBookmark(AppUser user, Job job) {
        this.user = user;
        this.job = job;
    }

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public Job getJob() {
        return job;
    }
}
