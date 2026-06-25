package com.careernet.mentoring.domain;

import com.careernet.common.domain.BaseTimeEntity;
import com.careernet.job.domain.Job;
import com.careernet.mentor.domain.Mentor;
import com.careernet.user.domain.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "mentoring_request")
public class MentoringRequest extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentoring_request_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Mentor mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "request_message", columnDefinition = "TEXT")
    private String requestMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MentoringRequestStatus status = MentoringRequestStatus.REQUESTED;

    protected MentoringRequest() {
    }

    public MentoringRequest(
            AppUser user,
            Mentor mentor,
            Job job,
            String requestMessage
    ) {
        this.user = user;
        this.mentor = mentor;
        this.job = job;
        this.requestMessage = requestMessage;
        this.status = MentoringRequestStatus.REQUESTED;
    }

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public Mentor getMentor() {
        return mentor;
    }

    public Job getJob() {
        return job;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public MentoringRequestStatus getStatus() {
        return status;
    }
}
