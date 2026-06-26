package com.careernet.recruitment.service;

import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.recruitment.dto.RecruitmentDto;
import com.careernet.recruitment.repository.RecruitmentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class RecruitmentService {

    private final RecruitmentRepository recruitmentRepository;

    public RecruitmentService(RecruitmentRepository recruitmentRepository) {
        this.recruitmentRepository = recruitmentRepository;
    }

    public List<RecruitmentDto.Response> getRecruitments() {
        return recruitmentRepository.findByDeletedAtIsNullOrderByDeadlineDateAscIdDesc()
                .stream()
                .map(RecruitmentDto.Response::from)
                .toList();
    }

    public List<RecruitmentDto.Response> getLatestRecruitments() {
        return recruitmentRepository.findTop4ByDeletedAtIsNullOrderByCreatedAtDesc()
                .stream()
                .map(RecruitmentDto.Response::from)
                .toList();
    }

    public RecruitmentDto.Response getRecruitment(Long recruitmentId) {
        return recruitmentRepository.findByIdAndDeletedAtIsNull(recruitmentId)
                .map(RecruitmentDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Recruitment not found."));
    }
}
