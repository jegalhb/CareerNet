package com.careernet.bookmark.service;

import com.careernet.bookmark.domain.JobBookmark;
import com.careernet.bookmark.dto.JobBookmarkDto;
import com.careernet.bookmark.repository.JobBookmarkRepository;
import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.job.domain.Job;
import com.careernet.job.repository.JobRepository;
import com.careernet.user.domain.AppUser;
import com.careernet.user.repository.AppUserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobBookmarkService {

    private final JobBookmarkRepository jobBookmarkRepository;
    private final AppUserRepository appUserRepository;
    private final JobRepository jobRepository;

    public JobBookmarkService(
            JobBookmarkRepository jobBookmarkRepository,
            AppUserRepository appUserRepository,
            JobRepository jobRepository
    ) {
        this.jobBookmarkRepository = jobBookmarkRepository;
        this.appUserRepository = appUserRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional(readOnly = true)
    public List<JobBookmarkDto.Response> getUserBookmarks(Long userId) {
        return jobBookmarkRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(JobBookmarkDto.Response::from)
                .toList();
    }

    @Transactional
    public JobBookmarkDto.Response createBookmark(Long userId, Long jobId) {
        return jobBookmarkRepository.findByUser_IdAndJob_Id(userId, jobId)
                .map(JobBookmarkDto.Response::from)
                .orElseGet(() -> JobBookmarkDto.Response.from(jobBookmarkRepository.save(new JobBookmark(
                        findUser(userId),
                        findJob(jobId)
                ))));
    }

    @Transactional
    public void deleteBookmark(Long userId, Long jobId) {
        jobBookmarkRepository.findByUser_IdAndJob_Id(userId, jobId)
                .ifPresent(jobBookmarkRepository::delete);
    }

    @Transactional(readOnly = true)
    public boolean existsBookmark(Long userId, Long jobId) {
        return jobBookmarkRepository.existsByUser_IdAndJob_Id(userId, jobId);
    }

    private AppUser findUser(Long userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    private Job findJob(Long jobId) {
        return jobRepository.findByIdAndDeletedAtIsNull(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));
    }
}
