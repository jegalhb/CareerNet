// src/components/career/MultiResultStep.jsx
import React, { useState } from 'react';
import { ASSESSMENT_LIST } from '../../data/assessmentRegistry';
import { getMatchLabel } from '../../utils/multiMatcher';

const MultiResultStep = ({ allResults, recommendations, selectedIds, onSelectJob, onReset }) => {
    const [activeTab, setActiveTab] = useState('recommend'); // 'recommend' | 검사ID
    const [filterCat, setFilterCat] = useState('전체');

    const selectedAssessments = ASSESSMENT_LIST.filter(a => selectedIds.includes(a.id));
    const categories = ['전체', ...new Set(recommendations.map(j => j.category))];
    const filtered   = filterCat === '전체'
        ? recommendations
        : recommendations.filter(j => j.category === filterCat);

    // ── 탭 목록 ───────────────────────────────────────────
    const TABS = [
        { id: 'recommend', label: '🎯 통합 추천' },
        ...selectedAssessments.map(a => ({ id: a.id, label: `${a.emoji} ${a.shortName}` })),
    ];

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* 완료 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                    {selectedIds.length}가지 검사 완료!
                </h2>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {selectedAssessments.map(a => (
                        <span key={a.id} style={{
                            fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                            background: a.bg, color: a.accent, fontWeight: 600,
                            border: `1px solid ${a.accent}30`,
                        }}>
              {a.emoji} {a.name} 완료
            </span>
                    ))}
                </div>
                {selectedIds.length > 1 && (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        ✨ {selectedIds.length}가지 검사 결과를 앙상블 통합하여 직업을 추천합니다
                    </p>
                )}
                {allResults.HOLLAND?.savedAssessmentId && (
                    <p style={{ fontSize: '12px', color: '#059669', margin: '8px 0 0' }}>
                        검사 결과가 저장되었습니다. 저장 ID: {allResults.HOLLAND.savedAssessmentId}
                    </p>
                )}
                {allResults.HOLLAND?.saveSkipped && (
                    <p style={{ fontSize: '12px', color: '#d97706', margin: '8px 0 0' }}>
                        로그인하면 검사 결과를 계정에 저장할 수 있습니다.
                    </p>
                )}
                {allResults.HOLLAND?.saveError && (
                    <p style={{ fontSize: '12px', color: '#b91c1c', margin: '8px 0 0' }}>
                        검사 결과 저장 실패: {allResults.HOLLAND.saveError}
                    </p>
                )}
            </div>

            {/* 탭 네비게이션 */}
            <div style={{
                display: 'flex', gap: 0, borderBottom: '2px solid #e5e7eb',
                background: '#fff', borderRadius: '12px 12px 0 0',
                overflowX: 'auto', marginBottom: '20px',
            }}>
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '11px 14px', border: 'none', background: 'none',
                        fontSize: '12px', fontWeight: activeTab === tab.id ? 700 : 400,
                        color: activeTab === tab.id ? '#1a365d' : '#6b7280',
                        borderBottom: activeTab === tab.id ? '2px solid #1a365d' : '2px solid transparent',
                        cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '-2px',
                        transition: 'all 0.15s',
                    }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── 통합 추천 탭 ── */}
            {activeTab === 'recommend' && (
                <div>
                    {/* 검사별 기여 요약 카드 */}
                    {selectedIds.length > 1 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Math.min(selectedIds.length, 4)}, 1fr)`,
                            gap: '10px', marginBottom: '20px',
                        }}>
                            {selectedAssessments.map(a => {
                                const res = allResults[a.id];
                                if (!res) return null;
                                // 주요 결과 요약 텍스트
                                let summary = '';
                                if (a.id === 'HOLLAND') summary = `코드: ${res.code}`;
                                else if (a.id === 'APTITUDE') summary = `강점: ${res.top3?.slice(0,2).join('·')}`;
                                else if (a.id === 'VALUES') summary = `가치: ${res.top3?.slice(0,2).join('·')}`;
                                else if (a.id === 'BIG5') summary = `특성: ${res.top3?.slice(0,2).join('·')}`;
                                return (
                                    <div key={a.id} style={{
                                        background: a.bg, border: `1px solid ${a.accent}30`,
                                        borderRadius: '10px', padding: '12px',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{a.emoji}</div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: a.accent, marginBottom: '2px' }}>
                                            {a.shortName}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#374151' }}>{summary}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 카테고리 필터 */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilterCat(cat)} style={{
                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
                                border: filterCat === cat ? 'none' : '1px solid #e5e7eb',
                                background: filterCat === cat ? '#1a365d' : '#fff',
                                color: filterCat === cat ? '#fff' : '#6b7280',
                                transition: 'all 0.15s',
                            }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* 직업 카드 리스트 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {filtered.map((job, idx) => {
                            const matchInfo = getMatchLabel(job.matchScore);
                            return (
                                <div
                                    key={job.id}
                                    onClick={() => onSelectJob(job)}
                                    style={{
                                        background: '#fff', borderRadius: '12px',
                                        border: '1px solid #e5e7eb', padding: '14px 16px',
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        cursor: 'pointer', transition: 'all 0.18s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#1a365d';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,54,93,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    {/* 순위 */}
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                                        background: idx < 3 ? '#1a365d' : '#f3f4f6',
                                        color: idx < 3 ? '#fff' : '#6b7280',
                                        fontSize: '11px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {idx + 1}
                                    </div>

                                    <span style={{ fontSize: '26px', flexShrink: 0 }}>{job.emoji}</span>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{job.title}</span>
                                            <span style={{ fontSize: '10px', background: '#f3f4f6', color: '#6b7280',
                                                padding: '1px 6px', borderRadius: '6px' }}>
                        {job.category}
                      </span>
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.desc}
                                        </p>

                                        {/* 검사별 기여 점수 표시 (복수 검사 시) */}
                                        {selectedIds.length > 1 && job.breakdown && (
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {Object.entries(job.breakdown).map(([id, score]) => {
                                                    const a = ASSESSMENT_LIST.find(x => x.id === id);
                                                    return a ? (
                                                        <span key={id} style={{
                                                            fontSize: '9px', padding: '1px 6px', borderRadius: '6px',
                                                            background: a.bg, color: a.accent, fontWeight: 500,
                                                        }}>
                              {a.emoji}{score}%
                            </span>
                                                    ) : null;
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{
                                            fontSize: '12px', fontWeight: 700,
                                            background: matchInfo.bg, color: matchInfo.color,
                                            padding: '3px 9px', borderRadius: '16px', marginBottom: '3px',
                                        }}>
                                            {job.matchScore}% {matchInfo.label}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>{job.avgSalary}</div>
                                    </div>
                                    <span style={{ color: '#9ca3af', fontSize: '14px', flexShrink: 0 }}>›</span>
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={onReset} style={{
                        width: '100%', padding: '10px', borderRadius: '8px',
                        border: '1px solid #e5e7eb', background: '#fff',
                        fontSize: '13px', color: '#6b7280', cursor: 'pointer',
                    }}>
                        ↺ 검사 다시 선택하기
                    </button>
                </div>
            )}

            {/* ── 검사별 세부 결과 탭 ── */}
            {selectedIds.includes(activeTab) && allResults[activeTab] && (
                <DetailResultPanel
                    assessId={activeTab}
                    result={allResults[activeTab]}
                    meta={ASSESSMENT_LIST.find(a => a.id === activeTab)}
                />
            )}
        </div>
    );
};

// ── 검사별 세부 결과 패널 ─────────────────────────────────────
const DetailResultPanel = ({ assessId, result, meta }) => {
    if (!result || !meta) return null;
    const { ranked = [] } = result;

    return (
        <div>
            {/* 요약 헤더 */}
            <div style={{
                background: meta.bg, border: `1px solid ${meta.accent}30`,
                borderRadius: '12px', padding: '16px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                <span style={{ fontSize: '36px' }}>{meta.emoji}</span>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                        {meta.name} 결과
                    </div>
                    {assessId === 'HOLLAND' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {(result.code || '').split('').map((c, i) => (
                                <span key={i} style={{
                                    fontSize: '16px', fontWeight: 800,
                                    color: ranked.find(r => r.type === c)?.color || meta.accent,
                                }}>
                  {c}
                </span>
                            ))}
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', alignSelf: 'flex-end' }}>
                Holland 코드
              </span>
                        </div>
                    )}
                    {assessId !== 'HOLLAND' && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            상위 강점: {ranked.slice(0, 3).map(r => r.name || r.dim).join(' · ')}
                        </div>
                    )}
                </div>
            </div>

            {/* 차원별 점수 바 */}
            <div style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '12px', padding: '16px',
            }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1a365d', margin: '0 0 14px' }}>
                    영역별 점수
                </h4>
                {ranked.map((item, i) => {
                    const label = item.name || item.dim || item.type;
                    const color = item.color || meta.accent;
                    const score = item.score;
                    return (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color, fontWeight: i < 3 ? 600 : 400 }}>
                  {i < 3 && '★ '}{item.emoji || ''} {label}
                    {item.fullName && item.fullName !== label && (
                        <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '4px' }}>
                      ({item.fullName})
                    </span>
                    )}
                </span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color }}>{score}점</span>
                            </div>
                            <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '6px' }}>
                                <div style={{
                                    background: color, height: '6px', borderRadius: '999px',
                                    width: `${score}%`, transition: 'width 0.6s ease',
                                }} />
                            </div>
                            {item.desc && (
                                <p style={{ fontSize: '10px', color: '#9ca3af', margin: '3px 0 0', lineHeight: 1.4 }}>
                                    {item.desc}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiResultStep;
