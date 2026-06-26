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

const IMAGE_BY_CATEGORY = {
    'IT/개발': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=700&auto=format&fit=crop',
    '데이터/AI': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=700&auto=format&fit=crop',
    '디자인/콘텐츠': 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=700&auto=format&fit=crop',
    '경영/기획': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=700&auto=format&fit=crop',
    '교육/상담': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=700&auto=format&fit=crop',
    '의료/보건': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=700&auto=format&fit=crop',
    '공학/제조': 'https://images.unsplash.com/photo-1581091215367-9b6c00b3035a?q=80&w=700&auto=format&fit=crop',
    '금융/법률': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=700&auto=format&fit=crop',
    '환경/에너지': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=700&auto=format&fit=crop',
    '미디어/문화': 'https://images.unsplash.com/photo-1497015289639-54688650d173?q=80&w=700&auto=format&fit=crop',
};

const IMAGE_BY_CODE_KEYWORD = [
    ['ai', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=700&auto=format&fit=crop'],
    ['data', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=700&auto=format&fit=crop'],
    ['developer', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=700&auto=format&fit=crop'],
    ['designer', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=700&auto=format&fit=crop'],
    ['doctor', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=700&auto=format&fit=crop'],
    ['nurse', 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=700&auto=format&fit=crop'],
    ['robotics', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=700&auto=format&fit=crop'],
    ['renewable', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=700&auto=format&fit=crop'],
];

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

export function getJobImage(job = {}) {
    const code = job.jobCode || '';
    const matched = IMAGE_BY_CODE_KEYWORD.find(([keyword]) => code.includes(keyword));
    return matched?.[1]
        || IMAGE_BY_CATEGORY[job.category]
        || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=700&auto=format&fit=crop';
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
        imageUrl: job.imageUrl || getJobImage(job),
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
