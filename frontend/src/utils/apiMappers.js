const DEFAULT_EMOJI_BY_CATEGORY = {
    'IT/개발': '💻',
    '데이터/AI': '📊',
    '디자인/콘텐츠': '🎨',
    '경영/기획': '📋',
    '교육/상담': '🧭',
    '의료/보건': '🩺',
    '공학/제조': '⚙️',
    '금융/법률': '💼',
    '환경/에너지': '🌱',
    '미디어/문화': '🎬',
};

function splitText(value) {
    if (!value) {
        return [];
    }
    return String(value)
        .split(/\s*(?:,|→|>|\/|\n)\s*/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function getEmoji(job) {
    const code = job.jobCode || '';
    if (code.includes('ai')) return '🤖';
    if (code.includes('data')) return '📊';
    if (code.includes('designer')) return '🎨';
    if (code.includes('developer') || code.includes('engineer')) return '💻';
    if (code.includes('counselor') || code.includes('teacher')) return '🧭';
    if (code.includes('doctor') || code.includes('nurse')) return '🩺';
    if (code.includes('law') || code.includes('account')) return '💼';
    return DEFAULT_EMOJI_BY_CATEGORY[job.category] || '✨';
}

function normalizeOutlook(outlookLabel = '') {
    if (outlookLabel.includes('밝') || outlookLabel.includes('성장')) {
        return 'up';
    }
    return 'stable';
}

export function mapApiJobToCard(job) {
    const skills = splitText(job.requiredSkills);
    const roadmapSteps = splitText(job.roadmap);
    const title = job.title || job.name;
    const summary = job.description || job.summary || `${title} 직무 정보를 확인해보세요.`;
    const hollandCodes = job.hollandTypes || job.hollandCodes || [];
    const mentors = job.relatedMentors || [];
    const topMentor = mentors[0];

    return {
        id: job.jobId,
        jobId: job.jobId,
        jobCode: job.jobCode,
        title,
        emoji: job.emoji || getEmoji(job),
        category: job.category,
        hollandCodes,
        avgSalary: job.avgSalary || '정보 준비 중',
        outlook: normalizeOutlook(job.outlookLabel),
        outlookLabel: job.outlookLabel || '정보 준비 중',
        requiredMajors: job.requiredMajors || [job.category].filter(Boolean),
        keySkills: skills.length ? skills.slice(0, 6) : hollandCodes.map((code) => `${code} 유형`),
        desc: summary,
        workEnv: job.summary || `${job.category || '관련'} 분야에서 다양한 실무자와 협업합니다.`,
        growthPath: job.roadmap || `${title} 입문 → 실무 경험 → 전문 분야 확장`,
        roadmapSteps: roadmapSteps.length ? roadmapSteps : ['기초 개념 학습', '관련 프로젝트 경험', '포트폴리오 정리', '실무자 멘토링'],
        videoUrl: '',
        mentorName: topMentor?.name || `${title} 멘토`,
        mentorRole: topMentor?.jobTitle || `${title} 실무자`,
        mentorQuote: topMentor?.headline || `${title} 분야의 실제 업무와 준비 과정을 알려드립니다.`,
        mentorOneLine: topMentor?.shortDescription || summary,
        mentorImage: topMentor?.profileImageUrl || null,
        relatedMentors: mentors,
        matchScore: job.matchScore,
        matchLabel: job.matchLabel,
        breakdown: job.breakdown,
        highlights: [
            { label: '평균 연봉', value: job.avgSalary || '정보 준비 중' },
            { label: '향후 전망', value: job.outlookLabel || '정보 준비 중' },
            { label: '직무 분야', value: job.category || '직업 정보' },
        ],
    };
}

export function mapApiMentorToCard(mentor) {
    return {
        mentorId: mentor.mentorId,
        name: mentor.name,
        jobTitle: mentor.jobTitle,
        companyName: mentor.companyName,
        profileImageUrl: mentor.profileImageUrl,
        headline: mentor.headline,
        shortDescription: mentor.shortDescription,
        interviewTitle: mentor.interviewTitle,
        interviewContent: mentor.interviewContent,
        careerSummary: mentor.careerSummary,
        recommendationCount: mentor.recommendationCount,
        relatedJobs: mentor.relatedJobs || [],
        priority: mentor.priority,
        recommendationWeight: mentor.recommendationWeight,
    };
}
