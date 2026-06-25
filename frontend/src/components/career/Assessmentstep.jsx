// src/components/career/AssessmentStep.jsx
import React, { useState } from 'react';
import { QUESTIONS, SCALE_LABELS } from '../../data/assessmentData';
import {
    getJobRecommendations,
    isAssessmentComplete,
    getAnsweredCount,
} from '../../utils/hollandMatcher';

const TYPE_COLORS = { R: '#d97706', I: '#2563eb', A: '#7c3aed', S: '#059669', E: '#dc2626', C: '#0891b2' };
const TYPE_NAMES  = { R: '실재형', I: '탐구형', A: '예술형', S: '사회형', E: '진취형', C: '관습형' };

const AssessmentStep = ({ onComplete }) => {
    const [answers, setAnswers] = useState({});        // { questionId: 1~5 }
    const [currentPage, setCurrentPage] = useState(0); // 4문항씩, 6페이지

    const QUESTIONS_PER_PAGE = 4;
    const totalPages = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE);
    const pageQuestions = QUESTIONS.slice(
        currentPage * QUESTIONS_PER_PAGE,
        (currentPage + 1) * QUESTIONS_PER_PAGE
    );
    const answeredCount = getAnsweredCount(answers);
    const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
    const isPageComplete = pageQuestions.every((q) => answers[q.id] !== undefined);

    const handleScore = (questionId, score) => {
        setAnswers((prev) => ({ ...prev, [questionId]: score }));
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((p) => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // 마지막 페이지 → 결과 계산
            const result = getJobRecommendations(answers);
            onComplete(result);
        }
    };

    const handlePrev = () => {
        setCurrentPage((p) => Math.max(0, p - 1));
    };

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                    display: 'inline-block',
                    background: '#eff6ff', color: '#1e40af',
                    padding: '4px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 500, marginBottom: '12px',
                }}>
                    Holland RIASEC 적성검사
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                    나의 진로 적성을 파악해 보세요
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    총 24문항 · 각 문항을 솔직하게 답해주세요 · 약 5분 소요
                </p>
            </div>

            {/* 진행 바 */}
            <div style={{
                background: '#fff', borderRadius: '12px', padding: '16px 20px',
                marginBottom: '20px', border: '1px solid #e5e7eb',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {currentPage + 1} / {totalPages} 페이지
          </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1a365d' }}>
            {answeredCount} / {QUESTIONS.length} 문항 완료 ({progress}%)
          </span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '6px' }}>
                    <div style={{
                        background: 'linear-gradient(90deg, #1a365d, #2563eb)',
                        height: '6px', borderRadius: '999px',
                        width: `${progress}%`, transition: 'width 0.3s ease',
                    }} />
                </div>
            </div>

            {/* 유형 색 범례 */}
            <div style={{
                display: 'flex', gap: '8px', flexWrap: 'wrap',
                marginBottom: '20px', justifyContent: 'center',
            }}>
                {Object.entries(TYPE_NAMES).map(([type, name]) => (
                    <span key={type} style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '12px',
                        background: TYPE_COLORS[type] + '15',
                        color: TYPE_COLORS[type], fontWeight: 500,
                        border: `1px solid ${TYPE_COLORS[type]}30`,
                    }}>
            {type} · {name}
          </span>
                ))}
            </div>

            {/* 문항 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {pageQuestions.map((q, idx) => {
                    const globalIdx   = currentPage * QUESTIONS_PER_PAGE + idx + 1;
                    const typeColor   = TYPE_COLORS[q.type];
                    const selectedVal = answers[q.id];

                    return (
                        <div key={q.id} style={{
                            background: '#fff', borderRadius: '12px',
                            border: selectedVal !== undefined
                                ? `1.5px solid ${typeColor}60`
                                : '1px solid #e5e7eb',
                            padding: '18px 20px',
                            transition: 'border-color 0.2s',
                        }}>
                            {/* 문항 번호 + 유형 뱃지 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: typeColor, color: '#fff',
                    fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                  {globalIdx}
                </span>
                                <span style={{
                                    fontSize: '10px', padding: '2px 8px',
                                    background: typeColor + '15', color: typeColor,
                                    borderRadius: '8px', fontWeight: 500,
                                    border: `1px solid ${typeColor}30`,
                                }}>
                  {TYPE_NAMES[q.type]}
                </span>
                            </div>

                            {/* 문항 텍스트 */}
                            <p style={{ fontSize: '14px', color: '#111827', lineHeight: '1.6', margin: '0 0 14px' }}>
                                {q.text}
                            </p>

                            {/* 척도 버튼 */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {SCALE_LABELS.map(({ value, label }) => {
                                    const isSelected = selectedVal === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleScore(q.id, value)}
                                            style={{
                                                flex: 1, minWidth: '72px',
                                                padding: '8px 4px', borderRadius: '8px',
                                                border: isSelected ? `2px solid ${typeColor}` : '1.5px solid #e5e7eb',
                                                background: isSelected ? typeColor + '10' : '#fff',
                                                color: isSelected ? typeColor : '#4b5563',
                                                fontSize: '11px', fontWeight: isSelected ? 700 : 400,
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ fontSize: '14px', marginBottom: '2px' }}>
                                                {['😶', '🙁', '😐', '🙂', '😄'][value - 1]}
                                            </div>
                                            {value}점
                                            <div style={{ fontSize: '9px', color: isSelected ? typeColor : '#9ca3af', marginTop: '1px' }}>
                                                {label}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    style={{
                        padding: '12px 24px', borderRadius: '8px',
                        border: '1.5px solid #e5e7eb', background: '#fff',
                        color: '#4b5563', fontSize: '14px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 0 ? 0.4 : 1,
                    }}
                >
                    ← 이전
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isPageComplete}
                    style={{
                        flex: 1, padding: '12px 24px', borderRadius: '8px', border: 'none',
                        background: isPageComplete ? '#1a365d' : '#e5e7eb',
                        color: isPageComplete ? '#fff' : '#9ca3af',
                        fontSize: '14px', fontWeight: 700,
                        cursor: isPageComplete ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s',
                    }}
                >
                    {currentPage < totalPages - 1
                        ? `다음 단계 (${currentPage + 2} / ${totalPages}) →`
                        : '✨ 결과 보기'}
                </button>
            </div>

            {/* 안내 */}
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
                이 페이지의 모든 문항에 응답해야 다음으로 넘어갈 수 있습니다.
            </p>
        </div>
    );
};

export default AssessmentStep;