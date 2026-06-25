package com.careernet.job.repository;

import com.careernet.job.domain.Job;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class MemoryJobRepository implements JobRepository {

    private final List<Job> jobs = List.of(
            new Job("job_001", "AI 엔지니어", "IT/데이터", "4,500만원 이상", "매우 밝음", "I R C"),
            new Job("job_002", "UX/UI 디자이너", "디자인", "3,500만원 이상", "밝음", "A S E"),
            new Job("job_003", "데이터 분석가", "IT/데이터", "4,000만원 이상", "밝음", "I C E"),
            new Job("job_004", "웹 개발자", "IT/개발", "3,800만원 이상", "매우 밝음", "I C R"),
            new Job("job_005", "로봇공학자", "공학", "4,200만원 이상", "밝음", "R I C"),
            new Job("job_006", "정보보안 전문가", "IT/보안", "4,300만원 이상", "매우 밝음", "I R C"),
            new Job("job_007", "게임 개발자", "IT/콘텐츠", "3,600만원 이상", "밝음", "A I R"),
            new Job("job_008", "영상 콘텐츠 기획자", "미디어", "3,200만원 이상", "보통", "A E S"),
            new Job("job_009", "서비스 기획자", "기획", "3,700만원 이상", "밝음", "E S C"),
            new Job("job_010", "클라우드 엔지니어", "IT/인프라", "4,500만원 이상", "매우 밝음", "R I C")
    );

    @Override
    public List<Job> findAll() {
        return jobs;
    }
}
