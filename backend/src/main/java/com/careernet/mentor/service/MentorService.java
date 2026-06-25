package com.careernet.mentor.service;

import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.mentor.domain.Mentor;
import com.careernet.mentor.dto.MentorDto;
import com.careernet.mentor.repository.MentorRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MentorService {

    private final MentorRepository mentorRepository;

    public MentorService(MentorRepository mentorRepository) {
        this.mentorRepository = mentorRepository;
    }

    public List<MentorDto.CardResponse> getMentors(String keyword) {
        return mentorRepository.findByActiveTrueAndDeletedAtIsNullOrderByRecommendationCountDesc()
                .stream()
                .filter(mentor -> containsKeyword(mentor, keyword))
                .map(MentorDto.CardResponse::from)
                .toList();
    }

    public MentorDto.DetailResponse getMentor(Long mentorId) {
        Mentor mentor = mentorRepository.findByIdAndActiveTrueAndDeletedAtIsNull(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found."));
        return MentorDto.DetailResponse.from(mentor);
    }

    private boolean containsKeyword(Mentor mentor, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String normalized = keyword.toLowerCase(Locale.ROOT);
        return contains(mentor.getName(), normalized)
                || contains(mentor.getJobTitle(), normalized)
                || contains(mentor.getCompanyName(), normalized)
                || contains(mentor.getHeadline(), normalized)
                || contains(mentor.getShortDescription(), normalized);
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }
}
