/**
 * Holland RIASEC 매칭 알고리즘
 *
 * 점수 계산 → 유형 랭킹 → 직업 매칭 → 적합도 스코어링
 */
import { QUESTIONS, TYPE_INFO } from '../data/AssessmentData.js';
import { JOB_DATABASE } from '../data/JobDatabase.js';

// ────────────────────────────────────────────
// 1. 원점수 계산
// ────────────────────────────────────────────
/**
 * @param {Object} answers  { questionId: score(1~5), ... }
 * @returns {Object}        { R: 0~20, I: 0~20, A: 0~20, S: 0~20, E: 0~20, C: 0~20 }
 */
export function calcRawScores(answers) {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    QUESTIONS.forEach(({ id, type }) => {
        const val = answers[id] ?? 0;
        scores[type] += val;
    });
    return scores;
}

// ────────────────────────────────────────────
// 2. 퍼센타일(비율) 점수 변환 (0~100)
// ────────────────────────────────────────────
/**
 * 문항당 최대 5점 × 4문항 = 20점 → 100점 만점으로 정규화
 */
export function calcPercentScores(rawScores) {
    const MAX_PER_TYPE = 20; // 4문항 × 5점
    return Object.fromEntries(
        Object.entries(rawScores).map(([type, score]) => [
            type,
            Math.round((score / MAX_PER_TYPE) * 100),
        ])
    );
}

// ────────────────────────────────────────────
// 3. 유형 순위 도출 (내림차순)
// ────────────────────────────────────────────
/**
 * @returns {Array} [{ type, score, rank }, ...] 점수 내림차순
 */
export function rankTypes(percentScores) {
    return Object.entries(percentScores)
        .map(([type, score]) => ({ type, score, ...TYPE_INFO[type] }))
        .sort((a, b) => b.score - a.score)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

// ────────────────────────────────────────────
// 4. Holland 3-letter 코드 생성
// ────────────────────────────────────────────
/**
 * 상위 3개 유형 코드를 조합 (예: "RIC", "AES")
 */
export function getHollandCode(rankedTypes) {
    return rankedTypes
        .slice(0, 3)
        .map((t) => t.type)
        .join('');
}

// ────────────────────────────────────────────
// 5. 직업 매칭 스코어 계산
// ────────────────────────────────────────────
/**
 * 직업 홀랜드 코드 vs 사용자 점수 기반 가중치 매칭
 *
 * 알고리즘:
 *   - 직업의 hollandCodes 순서별 가중치: 1위=0.5, 2위=0.3, 3위=0.2
 *   - 각 코드에 해당하는 사용자 퍼센트 점수 × 가중치 합산
 *   - 최종 0~100 적합도 점수 산출
 */
export function calcJobMatchScore(job, percentScores) {
    const weights = [0.5, 0.3, 0.2];
    let score = 0;
    job.hollandCodes.forEach((code, i) => {
        const w = weights[i] ?? 0.1;
        score += (percentScores[code] ?? 0) * w;
    });
    return Math.round(score);
}

// ────────────────────────────────────────────
// 6. 최종 직업 추천 목록 생성
// ────────────────────────────────────────────
/**
 * @param {Object} answers  { questionId: score }
 * @param {number} topN     추천 직업 개수 (기본 5)
 * @returns {Object}        { hollandCode, rankedTypes, percentScores, recommendations }
 */
export function getJobRecommendations(answers, topN = 8) {
    const rawScores     = calcRawScores(answers);
    const percentScores = calcPercentScores(rawScores);
    const rankedTypes   = rankTypes(percentScores);
    const hollandCode   = getHollandCode(rankedTypes);

    const recommendations = JOB_DATABASE
        .map((job) => ({
            ...job,
            matchScore: calcJobMatchScore(job, percentScores),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, topN);

    return {
        rawScores,
        percentScores,
        rankedTypes,
        hollandCode,
        recommendations,
    };
}

// ────────────────────────────────────────────
// 7. 적합도 레이블 변환
// ────────────────────────────────────────────
export function getMatchLabel(score) {
    if (score >= 80) return { label: '매우 적합', color: '#059669', bg: '#d1fae5' };
    if (score >= 65) return { label: '적합',     color: '#2563eb', bg: '#dbeafe' };
    if (score >= 50) return { label: '보통',     color: '#d97706', bg: '#fef3c7' };
    return             { label: '참고용',        color: '#6b7280', bg: '#f3f4f6' };
}

// ────────────────────────────────────────────
// 8. 검사 완료 여부 확인
// ────────────────────────────────────────────
export function isAssessmentComplete(answers) {
    return QUESTIONS.every((q) => answers[q.id] !== undefined);
}

export function getAnsweredCount(answers) {
    return Object.keys(answers).length;
}