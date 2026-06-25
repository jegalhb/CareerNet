// src/components/career/MultiAssessmentRunner.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    ASSESSMENT_LIST, ASSESSMENT_QUESTIONS, SCALE_LABELS,
} from '../../data/assessmentRegistry';
import {
    calcHollandResult, calcAptitudeResult,
    calcValuesResult, calcBig5Result,
    getEnsembleRecommendations, getProgress, isComplete,
} from '../../utils/multiMatcher';

const CALC_MAP = {
    HOLLAND:  calcHollandResult,
    APTITUDE: calcAptitudeResult,
    VALUES:   calcValuesResult,
    BIG5:     calcBig5Result,
};

const MultiAssessmentRunner = ({ selectedIds, onComplete, onBack }) => {
    const [currentIdx, setCurrentIdx]   = useState(0);
    const [allAnswers, setAllAnswers]    = useState({});
    const [pageIdx, setPageIdx]          = useState(0);
    const [completedIds, setCompleted]   = useState([]);
    const [isScrolled, setIsScrolled]   = useState(false); // 스크롤 감지 → 그림자 토글

    // 스크롤 감지: 진행 바가 GNB·스테퍼 아래 붙으면 그림자 표시
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const QUESTIONS_PER_PAGE = 4;
    const currentId       = selectedIds[currentIdx];
    const currentMeta     = ASSESSMENT_LIST.find(a => a.id === currentId);
    const currentQuestions= ASSESSMENT_QUESTIONS[currentId] || [];
    const currentAnswers  = allAnswers[currentId] || {};

    const totalPages    = Math.ceil(currentQuestions.length / QUESTIONS_PER_PAGE);
    const pageQuestions = currentQuestions.slice(
        pageIdx * QUESTIONS_PER_PAGE,
        (pageIdx + 1) * QUESTIONS_PER_PAGE
    );
    const { answered, total, pct: progressPct } = getProgress(currentQuestions, currentAnswers);
    const pageComplete = pageQuestions.every(q => currentAnswers[q.id] !== undefined);

    const setAnswer = (qid, val) => {
        setAllAnswers(prev => ({
            ...prev,
            [currentId]: { ...(prev[currentId] || {}), [qid]: val },
        }));
    };

    const handleNextPage = () => {
        if (pageIdx < totalPages - 1) {
            setPageIdx(p => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // 현재 검사 완료
            setCompleted(prev => [...prev, currentId]);
            if (currentIdx < selectedIds.length - 1) {
                // 다음 검사로
                setCurrentIdx(i => i + 1);
                setPageIdx(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // 전체 완료 → 결과 계산
                const results = {};
                selectedIds.forEach(id => {
                    const answers = { ...(allAnswers[id] || {}), ...(id === currentId ? currentAnswers : {}) };
                    results[id] = CALC_MAP[id](answers);
                });
                // 현재 답변도 포함
                results[currentId] = CALC_MAP[currentId]({ ...currentAnswers });
                const recs = getEnsembleRecommendations(results);
                onComplete(results, recs);
            }
        }
    };

    const handlePrevPage = () => {
        if (pageIdx > 0) {
            setPageIdx(p => p - 1);
        } else if (currentIdx > 0) {
            // 이전 검사로 돌아가기
            setCurrentIdx(i => i - 1);
            const prevId = selectedIds[currentIdx - 1];
            const prevQ  = ASSESSMENT_QUESTIONS[prevId] || [];
            setPageIdx(Math.ceil(prevQ.length / QUESTIONS_PER_PAGE) - 1);
        } else {
            onBack();
        }
    };

    // 전체 진행률 (모든 검사 기준)
    const totalAllQ    = selectedIds.reduce((s, id) => s + (ASSESSMENT_QUESTIONS[id]?.length || 0), 0);
    const doneAllQ     = completedIds.reduce((s, id) => s + (ASSESSMENT_QUESTIONS[id]?.length || 0), 0);
    const currentDoneQ = answered;
    const overallPct   = Math.round(((doneAllQ + currentDoneQ) / totalAllQ) * 100);

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* ── Sticky 진행 바 ──────────────────────────────────
           GNB(56px) + 스테퍼(52px) = top: 108px
           스크롤 감지 → boxShadow로 "떠 있는" 느낌 연출
      ─────────────────────────────────────────────────── */}
            <div style={{
                position: 'sticky',
                top: '58px',
                zIndex: 800,
                marginLeft: '-16px',
                marginRight: '-16px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '10px',
                paddingTop: '4px',
                background: 'linear-gradient(to bottom, #f9fafb 82%, transparent)',
                filter: isScrolled ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.07))' : 'none',
                transition: 'filter 0.25s',
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: isScrolled ? '1px solid #cbd5e1' : '1px solid #e5e7eb',
                    boxShadow: isScrolled ? '0 2px 14px rgba(26,54,93,0.09)' : 'none',
                    padding: '12px 16px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>

                    {/* 윗줄: 검사 뱃지 + 전체 % */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '8px',
                    }}>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {selectedIds.map((id, i) => {
                                const a         = ASSESSMENT_LIST.find(x => x.id === id);
                                const isDone    = completedIds.includes(id);
                                const isCurrent = id === currentId;
                                return (
                                    <span key={id} style={{
                                        fontSize: '11px', padding: '2px 9px', borderRadius: '10px',
                                        background: isDone ? '#d1fae5' : isCurrent ? a.bg : '#f3f4f6',
                                        color:      isDone ? '#059669' : isCurrent ? a.accent : '#9ca3af',
                                        fontWeight: isCurrent ? 700 : 500,
                                        border: isCurrent
                                            ? `1.5px solid ${a.accent}`
                                            : isDone ? '1px solid #6ee7b7' : '1px solid transparent',
                                        display: 'flex', alignItems: 'center', gap: '3px',
                                        transition: 'all 0.2s',
                                    }}>
                    <span style={{ fontSize: '9px' }}>
                      {isDone ? '✓' : isCurrent ? '▶' : i + 1}
                    </span>
                                        {a.emoji} {a.shortName}
                  </span>
                                );
                            })}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a365d', flexShrink: 0, marginLeft: '8px' }}>
              {overallPct}%
            </span>
                    </div>

                    {/* 전체 진행률 바 */}
                    <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '5px', marginBottom: '8px' }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #1a365d, #2563eb)',
                            height: '5px', borderRadius: '999px',
                            width: `${overallPct}%`,
                            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
                        }} />
                    </div>

                    {/* 아랫줄: 페이지 도트 인디케이터 + 현재 문항 수 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#9ca3af', marginRight: '3px' }}>
                {currentMeta?.emoji} 페이지
              </span>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <div key={i} style={{
                                    width:        i === pageIdx ? '18px' : '6px',
                                    height:       '6px',
                                    borderRadius: '999px',
                                    background:   i === pageIdx
                                        ? (currentMeta?.accent || '#1a365d')
                                        : i < pageIdx ? '#93c5fd' : '#e5e7eb',
                                    transition: 'all 0.25s ease',
                                }} />
                            ))}
                            <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '3px' }}>
                {pageIdx + 1}/{totalPages}
              </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>
              이 검사 {answered}/{total}문항
            </span>
                    </div>

                </div>
            </div>

            {/* 현재 검사 헤더 */}
            <div style={{
                background: currentMeta?.bg || '#eff6ff',
                border: `1.5px solid ${currentMeta?.accent || '#2563eb'}30`,
                borderRadius: '12px', padding: '16px 18px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                <span style={{ fontSize: '32px' }}>{currentMeta?.emoji}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                        {currentIdx + 1}/{selectedIds.length} &nbsp;·&nbsp; {currentMeta?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {pageIdx + 1}/{totalPages} 페이지 &nbsp;·&nbsp; {answered}/{total}문항 완료 ({progressPct}%)
                    </div>
                </div>
                <div style={{
                    background: currentMeta?.accent, color: '#fff',
                    fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                    borderRadius: '10px',
                }}>
                    {currentMeta?.badge}
                </div>
            </div>

            {/* 문항 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {pageQuestions.map((q, localIdx) => {
                    const globalNum = pageIdx * QUESTIONS_PER_PAGE + localIdx + 1;
                    const dimColor  = currentMeta
                        ? (ASSESSMENT_LIST.find(a => a.id === currentId)?.accent || '#1a365d')
                        : '#1a365d';
                    const selected  = currentAnswers[q.id];

                    // 차원 색상 (검사별 meta에서)
                    let dimColorActual = dimColor;
                    try {
                        const meta = require('../../data/assessmentRegistry')[`${currentId}_META`];
                        if (meta?.dimensionColors?.[q.dim]) dimColorActual = meta.dimensionColors[q.dim];
                    } catch {}

                    return (
                        <div key={q.id} style={{
                            background: '#fff', borderRadius: '12px',
                            border: selected !== undefined
                                ? `1.5px solid ${dimColorActual}50`
                                : '1px solid #e5e7eb',
                            padding: '16px 18px', transition: 'border-color 0.2s',
                        }}>
                            {/* 문항 번호 + 차원 뱃지 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: dimColorActual, color: '#fff',
                    fontSize: '10px', fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                  {globalNum}
                </span>
                                <span style={{
                                    fontSize: '10px', padding: '2px 8px',
                                    background: dimColorActual + '15', color: dimColorActual,
                                    borderRadius: '8px', fontWeight: 500,
                                    border: `1px solid ${dimColorActual}30`,
                                }}>
                  {q.dim}
                </span>
                            </div>

                            {/* 문항 텍스트 */}
                            <p style={{ fontSize: '14px', color: '#111827', lineHeight: '1.6', margin: '0 0 14px' }}>
                                {q.text}
                            </p>

                            {/* 척도 버튼 */}
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {SCALE_LABELS.map(({ value, label, emoji }) => {
                                    const isSel = selected === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setAnswer(q.id, value)}
                                            style={{
                                                flex: 1, minWidth: '52px',
                                                padding: '7px 2px', borderRadius: '8px',
                                                border: isSel ? `2px solid ${dimColorActual}` : '1.5px solid #e5e7eb',
                                                background: isSel ? dimColorActual + '12' : '#fff',
                                                color: isSel ? dimColorActual : '#6b7280',
                                                fontSize: '10px', fontWeight: isSel ? 700 : 400,
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ fontSize: '14px', marginBottom: '2px' }}>{emoji}</div>
                                            {value}
                                            <div style={{ fontSize: '9px', color: isSel ? dimColorActual : '#c4c4c4', marginTop: '1px' }}>
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

            {/* 네비게이션 */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrevPage} style={{
                    padding: '12px 20px', borderRadius: '8px',
                    border: '1.5px solid #e5e7eb', background: '#fff',
                    fontSize: '13px', color: '#4b5563', cursor: 'pointer',
                }}>← 이전</button>

                <button
                    onClick={handleNextPage}
                    disabled={!pageComplete}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                        background: pageComplete ? '#1a365d' : '#e5e7eb',
                        color: pageComplete ? '#fff' : '#9ca3af',
                        fontSize: '13px', fontWeight: 700,
                        cursor: pageComplete ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s',
                    }}
                >
                    {pageIdx < totalPages - 1
                        ? `다음 (${pageIdx + 2}/${totalPages}) →`
                        : currentIdx < selectedIds.length - 1
                            ? `다음 검사: ${ASSESSMENT_LIST.find(a => a.id === selectedIds[currentIdx + 1])?.shortName} →`
                            : '✨ 모든 검사 완료 · 결과 보기'}
                </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
                이 페이지의 모든 문항에 응답해야 다음으로 진행할 수 있습니다.
            </p>
        </div>
    );
};

export default MultiAssessmentRunner;