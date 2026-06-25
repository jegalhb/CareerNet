package com.careernet.mentoring.service;

import com.careernet.common.exception.BusinessException;
import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.job.domain.Job;
import com.careernet.job.repository.JobRepository;
import com.careernet.mentor.domain.Mentor;
import com.careernet.mentor.repository.MentorRepository;
import com.careernet.mentoring.domain.MentoringRequest;
import com.careernet.mentoring.domain.MentoringRequestStatus;
import com.careernet.mentoring.dto.MentoringRequestDto;
import com.careernet.mentoring.repository.MentoringRequestRepository;
import com.careernet.user.domain.AppUser;
import com.careernet.user.repository.AppUserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MentoringRequestService {

    private final MentoringRequestRepository mentoringRequestRepository;
    private final AppUserRepository appUserRepository;
    private final MentorRepository mentorRepository;
    private final JobRepository jobRepository;

    public MentoringRequestService(
            MentoringRequestRepository mentoringRequestRepository,
            AppUserRepository appUserRepository,
            MentorRepository mentorRepository,
            JobRepository jobRepository
    ) {
        this.mentoringRequestRepository = mentoringRequestRepository;
        this.appUserRepository = appUserRepository;
        this.mentorRepository = mentorRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public MentoringRequestDto.Response createRequest(MentoringRequestDto.CreateRequest request) {
        AppUser user = appUserRepository.findById(request.getUserId())
                .filter(found -> found.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Mentor mentor = mentorRepository.findByIdAndActiveTrueAndDeletedAtIsNull(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found."));

        Job job = jobRepository.findByIdAndDeletedAtIsNull(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));

        boolean alreadyRequested = mentoringRequestRepository.existsByUser_IdAndMentor_IdAndJob_IdAndStatus(
                user.getId(),
                mentor.getId(),
                job.getId(),
                MentoringRequestStatus.REQUESTED
        );
        if (alreadyRequested) {
            throw new BusinessException("Already requested mentoring.");
        }

        MentoringRequest mentoringRequest = new MentoringRequest(
                user,
                mentor,
                job,
                trimToNull(request.getRequestMessage())
        );
        return MentoringRequestDto.Response.from(mentoringRequestRepository.save(mentoringRequest));
    }

    public List<MentoringRequestDto.Response> getUserRequests(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found.");
        }

        return mentoringRequestRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(MentoringRequestDto.Response::from)
                .toList();
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
