/**
 * multiMatcher.js
 * ─────────────────────────────────────────────────────────────
 * 4가지 검사 결과를 통합해 직업을 추천하는 앙상블 매칭 엔진
 *
 * 알고리즘 흐름:
 *   1. 각 검사별 원점수 → 0~100 퍼센트 점수 계산
 *   2. 각 검사별 직업 매칭 점수 계산 (jobDatabase의 태그 기반)
 *   3. 선택된 검사별 가중치로 최종 점수 앙상블
 *   4. 정렬 후 상위 N개 반환
 * ─────────────────────────────────────────────────────────────
 */

import {
    HOLLAND_META, APTITUDE_META, VALUES_META, BIG5_META,
    HOLLAND_QUESTIONS, APTITUDE_QUESTIONS, VALUES_QUESTIONS, BIG5_QUESTIONS,
    BIG5_QUESTIONS as BIG5_Q,
} from '../data/assessmentRegistry';
import { JOB_DATABASE } from '../data/jobDatabase';

// ══════════════════════════════════════════════════════════════
// 직업 태그 시스템 확장 (jobDatabase.js에 아래 필드들이 추가되어야 함)
// 여기서는 내부 매핑 테이블로 처리
// ══════════════════════════════════════════════════════════════

/**
 * 직업별 적성·가치관·성격 태그 매핑
 * key: jobId, value: { aptitude, values, big5 }
 *   aptitude: 주요 적성 영역 (최대 3개)
 *   values  : 주요 가치관 (최대 3개)
 *   big5    : 높아야 하는 Big5 요인 (O/C/E/A/N)
 */
const JOB_TAGS = {
    job_001: { aptitude: ['탐구','수리','리더'],  values: ['성장','창의','성취'],  big5: ['O','C','N'] },
    job_002: { aptitude: ['창의','공간','사회'],  values: ['창의','자율','성장'],  big5: ['O','A','N'] },
    job_003: { aptitude: ['탐구','수리','언어'],  values: ['성취','성장','창의'],  big5: ['O','C','N'] },
    job_004: { aptitude: ['탐구','창의','공간'],  values: ['성장','창의','자율'],  big5: ['O','C','N'] },
    job_005: { aptitude: ['탐구','수리','리더'],  values: ['성장','성취','안정'],  big5: ['C','O','N'] },
    job_006: { aptitude: ['탐구','수리','신체'],  values: ['안정','성취','사회기여'],big5:['C','N','O'] },
    job_007: { aptitude: ['창의','리더','언어'],  values: ['창의','자율','성취'],  big5: ['O','E','A'] },
    job_008: { aptitude: ['창의','사회','언어'],  values: ['자율','창의','성취'],  big5: ['O','E','A'] },
    job_009: { aptitude: ['사회','언어','탐구'],  values: ['사회기여','인간관계','균형'], big5:['A','E','N'] },
    job_010: { aptitude: ['탐구','수리','리더'],  values: ['성장','성취','보수'],  big5: ['C','O','N'] },
    job_011: { aptitude: ['리더','언어','사회'],  values: ['창의','성취','명예'],  big5: ['E','O','A'] },
    job_012: { aptitude: ['탐구','신체','수리'],  values: ['성취','성장','안정'],  big5: ['C','O','N'] },
    job_013: { aptitude: ['리더','창의','사회'],  values: ['성취','자율','명예'],  big5: ['E','O','C'] },
    job_014: { aptitude: ['수리','탐구','언어'],  values: ['안정','보수','성취'],  big5: ['C','N','A'] },
    job_015: { aptitude: ['신체','탐구','창의'],  values: ['성취','성장','창의'],  big5: ['C','O','N'] },
};

// ══════════════════════════════════════════════════════════════
// 1. 공통 점수 계산 유틸
// ══════════════════════════════════════════════════════════════

/** 문항별 응답 → 차원별 원점수 집계 */
function calcRaw(questions, answers) {
    const scores = {};
    questions.forEach(({ id, dim }) => {
        if (!scores[dim]) scores[dim] = 0;
        scores[dim] += answers[id] ?? 0;
    });
    return scores;
}

/** 원점수 → 0~100 퍼센트 점수 (maxPerDim = 문항수 × 5) */
function toPercent(rawScores, questionsPerDim) {
    const max = questionsPerDim * 5;
    return Object.fromEntries(
        Object.entries(rawScores).map(([dim, raw]) => [dim, Math.round((raw / max) * 100)])
    );
}

/** 배열 기준 내림차순 정렬 반환 */
function sortedEntries(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

// ══════════════════════════════════════════════════════════════
// 2. 검사별 개별 결과 계산
// ══════════════════════════════════════════════════════════════

export function calcHollandResult(answers) {
    const raw  = calcRaw(HOLLAND_QUESTIONS, answers);
    const pct  = toPercent(raw, 4); // 4문항/유형
    const ranked = sortedEntries(pct).map(([type, score], i) => ({
        type, score, rank: i + 1,
        name:  HOLLAND_META.dimensionNames[type],
        emoji: HOLLAND_META.dimensionEmojis[type],
        color: HOLLAND_META.dimensionColors[type],
        desc:  HOLLAND_META.dimensionDescs[type],
    }));
    const code = ranked.slice(0, 3).map(r => r.type).join('');
    return { raw, pct, ranked, code, primaryType: ranked[0]?.type };
}

export function calcAptitudeResult(answers) {
    const raw  = calcRaw(APTITUDE_QUESTIONS, answers);
    const pct  = toPercent(raw, 3); // 3문항/영역
    const ranked = sortedEntries(pct).map(([dim, score], i) => ({
        dim, score, rank: i + 1,
        name:  APTITUDE_META.dimensionNames[dim],
        emoji: APTITUDE_META.dimensionEmojis[dim],
        color: APTITUDE_META.dimensionColors[dim],
    }));
    return { raw, pct, ranked, top3: ranked.slice(0, 3).map(r => r.dim) };
}

export function calcValuesResult(answers) {
    const raw  = calcRaw(VALUES_QUESTIONS, answers);
    const pct  = toPercent(raw, 2); // 2문항/가치
    const ranked = sortedEntries(pct).map(([dim, score], i) => ({
        dim, score, rank: i + 1,
        name:  VALUES_META.dimensionNames[dim],
        emoji: VALUES_META.dimensionEmojis[dim],
        color: VALUES_META.dimensionColors[dim],
    }));
    return { raw, pct, ranked, top3: ranked.slice(0, 3).map(r => r.dim) };
}

export function calcBig5Result(answers) {
    const raw = calcRaw(BIG5_QUESTIONS, answers);
    // N은 역환산: 안정성 = 100 - N원점수%
    const pct = toPercent(raw, 4); // 4문항/요인
    const adjusted = { ...pct, N: 100 - (pct.N ?? 0) }; // 정서안정 점수로 변환
    const ranked = sortedEntries(adjusted).map(([dim, score], i) => ({
        dim, score, rank: i + 1,
        name:  BIG5_META.dimensionShortNames[dim],
        fullName: BIG5_META.dimensionNames[dim],
        emoji: BIG5_META.dimensionEmojis[dim],
        color: BIG5_META.dimensionColors[dim],
        desc:  BIG5_META.dimensionDescs[dim],
    }));
    return { raw, pct, adjusted, ranked, top3: ranked.slice(0, 3).map(r => r.dim) };
}

// ══════════════════════════════════════════════════════════════
// 3. 검사별 직업 매칭 점수
// ══════════════════════════════════════════════════════════════

/** Holland: 기존 hollandCodes 가중치 매핑 */
function hollandJobScore(job, pct) {
    const codes = Array.isArray(job.hollandCodes)
        ? job.hollandCodes
        : String(job.hollandCodes || '').trim().split(/\s+/).filter(Boolean);

    const weights = [0.5, 0.3, 0.2];

    return Math.round(
        codes.reduce((sum, c, i) => {
            return sum + (pct[c] ?? 0) * (weights[i] ?? 0.1);
        }, 0)
    );
}

/** 적성/가치관/Big5: JOB_TAGS 기반 상위 매칭 */
function tagJobScore(jobId, tagKey, pct) {
    const tags = (JOB_TAGS[jobId]?.[tagKey] || []);
    if (!tags.length) return 50; // 태그 없으면 중간값
    const weights = [0.5, 0.3, 0.2];
    return Math.round(tags.reduce((sum, tag, i) => sum + (pct[tag] ?? 0) * (weights[i] ?? 0.1), 0));
}

// ══════════════════════════════════════════════════════════════
// 4. 앙상블 통합 추천
// ══════════════════════════════════════════════════════════════

/**
 * 선택된 검사 결과를 통합해 직업 추천 목록 반환
 *
 * @param {Object} selectedResults  { HOLLAND, APTITUDE, VALUES, BIG5 } — 선택된 것만 존재
 * @param {number} topN             추천 직업 개수
 * @returns {Array}                 직업 객체 배열 (matchScore 포함)
 */
export function getEnsembleRecommendations(selectedResults, topN = 8) {
    const selectedKeys = Object.keys(selectedResults);
    if (!selectedKeys.length) return [];

    // 가중치: 검사 개수에 따라 균등 배분
    const weight = 1 / selectedKeys.length;

    return JOB_DATABASE
        .map((job) => {
            let totalScore = 0;
            const breakdown = {}; // 검사별 기여 점수

            if (selectedResults.HOLLAND) {
                const s = hollandJobScore(job, selectedResults.HOLLAND.pct);
                totalScore += s * weight;
                breakdown.HOLLAND = s;
            }
            if (selectedResults.APTITUDE) {
                const s = tagJobScore(job.id, 'aptitude', selectedResults.APTITUDE.pct);
                totalScore += s * weight;
                breakdown.APTITUDE = s;
            }
            if (selectedResults.VALUES) {
                const s = tagJobScore(job.id, 'values', selectedResults.VALUES.pct);
                totalScore += s * weight;
                breakdown.VALUES = s;
            }
            if (selectedResults.BIG5) {
                const s = tagJobScore(job.id, 'big5', selectedResults.BIG5.adjusted);
                totalScore += s * weight;
                breakdown.BIG5 = s;
            }

            return { ...job, matchScore: Math.round(totalScore), breakdown };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, topN);
}

// ══════════════════════════════════════════════════════════════
// 5. 적합도 레이블
// ══════════════════════════════════════════════════════════════
export function getMatchLabel(score) {
    if (score >= 80) return { label: '매우 적합', color: '#059669', bg: '#d1fae5' };
    if (score >= 65) return { label: '적합',     color: '#2563eb', bg: '#dbeafe' };
    if (score >= 50) return { label: '보통',     color: '#d97706', bg: '#fef3c7' };
    return             { label: '참고용',        color: '#6b7280', bg: '#f3f4f6' };
}

// ══════════════════════════════════════════════════════════════
// 6. 진행률 유틸
// ══════════════════════════════════════════════════════════════
export function getProgress(questions, answers) {
    const answered = questions.filter(q => answers[q.id] !== undefined).length;
    return { answered, total: questions.length, pct: Math.round((answered / questions.length) * 100) };
}

export function isComplete(questions, answers) {
    return questions.every(q => answers[q.id] !== undefined);
}