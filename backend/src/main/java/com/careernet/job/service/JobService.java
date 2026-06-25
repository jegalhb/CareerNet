package com.careernet.job.service;

import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.job.domain.Job;
import com.careernet.job.dto.JobDto;
import com.careernet.job.repository.JobRepository;
import com.careernet.mentor.dto.MentorDto;
import com.careernet.mentor.repository.MentorJobRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class JobService {

    private final JobRepository jobRepository;
    private final MentorJobRepository mentorJobRepository;

    public JobService(
            JobRepository jobRepository,
            MentorJobRepository mentorJobRepository
    ) {
        this.jobRepository = jobRepository;
        this.mentorJobRepository = mentorJobRepository;
    }

    public List<JobDto.SummaryResponse> getJobs(String category, String keyword) {
        List<Job> jobs = hasText(category)
                ? jobRepository.findByCategoryAndDeletedAtIsNullOrderByNameAsc(category)
                : jobRepository.findByDeletedAtIsNullOrderByNameAsc();

        return jobs.stream()
                .filter(job -> job.containsKeyword(keyword))
                .map(JobDto.SummaryResponse::from)
                .toList();
    }

    public JobDto.DetailResponse getJob(Long jobId) {
        Job job = findActiveJob(jobId);
        List<MentorDto.CardResponse> relatedMentors = getJobMentors(jobId);
        return JobDto.DetailResponse.of(job, relatedMentors);
    }

    public List<MentorDto.CardResponse> getJobMentors(Long jobId) {
        findActiveJob(jobId);
        return mentorJobRepository
                .findByJob_IdAndMentor_ActiveTrueAndMentor_DeletedAtIsNullOrderByPriorityAscRecommendationWeightDesc(jobId)
                .stream()
                .map(MentorDto.CardResponse::from)
                .toList();
    }

    public MentorDto.CardResponse getTopMentor(Long jobId) {
        findActiveJob(jobId);
        return mentorJobRepository
                .findByJob_IdAndMentor_ActiveTrueAndMentor_DeletedAtIsNullOrderByMentor_RecommendationCountDescPriorityAscRecommendationWeightDesc(jobId)
                .stream()
                .findFirst()
                .map(MentorDto.CardResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found for job."));
    }

    private Job findActiveJob(Long jobId) {
        return jobRepository.findByIdAndDeletedAtIsNull(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
