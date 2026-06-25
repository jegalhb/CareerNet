// src/components/career/AssessmentSelector.jsx
import React, { useState } from 'react';
import { ASSESSMENT_LIST } from '../../data/assessmentRegistry';

const AssessmentSelector = ({ onConfirm }) => {
    const [selected, setSelected] = useState(['HOLLAND']); // 기본 Holland 선택

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.length > 1 ? prev.filter(x => x !== id) : prev // 최소 1개
                : [...prev, id]
        );
    };

    const totalQ  = ASSESSMENT_LIST
        .filter(a => selected.includes(a.id))
        .reduce((s, a) => s + a.questionCount, 0);
    const totalMin = ASSESSMENT_LIST
        .filter(a => selected.includes(a.id))
        .reduce((s, a) => s + parseInt(a.duration), 0);

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span style={{
            display: 'inline-block', background: '#eff6ff', color: '#1e40af',
            padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
            fontWeight: 500, marginBottom: '12px',
        }}>
          다중 적성검사 시스템
        </span>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                    나에게 맞는 검사를 선택해주세요
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    여러 검사를 선택할수록 더 정확한 진로 추천을 받을 수 있습니다 · 최소 1개 필수
                </p>
            </div>

            {/* 검사 카드 그리드 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px', marginBottom: '24px',
            }}>
                {ASSESSMENT_LIST.map((assessment) => {
                    const isOn = selected.includes(assessment.id);
                    return (
                        <div
                            key={assessment.id}
                            onClick={() => toggle(assessment.id)}
                            style={{
                                background: '#fff',
                                border: isOn ? `2px solid ${assessment.accent}` : '1.5px solid #e5e7eb',
                                borderRadius: '14px', padding: '20px',
                                cursor: 'pointer', transition: 'all 0.18s',
                                position: 'relative',
                                boxShadow: isOn ? `0 4px 16px ${assessment.accent}20` : 'none',
                                transform: isOn ? 'translateY(-2px)' : 'none',
                            }}
                        >
                            {/* 선택 체크박스 */}
                            <div style={{
                                position: 'absolute', top: '14px', right: '14px',
                                width: '22px', height: '22px', borderRadius: '50%',
                                border: isOn ? `none` : '2px solid #d1d5db',
                                background: isOn ? assessment.accent : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                            }}>
                                {isOn && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                            </div>

                            {/* 이모지 + 뱃지 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: assessment.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                }}>
                  {assessment.emoji}
                </span>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                      {assessment.name}
                    </span>
                                    </div>
                                    <span style={{
                                        fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                                        background: assessment.bg, color: assessment.accent,
                                        fontWeight: 600, border: `1px solid ${assessment.accent}30`,
                                        marginTop: '3px', display: 'inline-block',
                                    }}>
                    {assessment.badge}
                  </span>
                                </div>
                            </div>

                            {/* 설명 */}
                            <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 12px' }}>
                                {assessment.description}
                            </p>

                            {/* 상세 설명 */}
                            <p style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.5', margin: '0 0 12px',
                                borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                                {assessment.detail}
                            </p>

                            {/* 메타 정보 */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  📝 {assessment.questionCount}문항
                </span>
                                <span style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  ⏱ {assessment.duration}
                </span>
                            </div>

                            {/* 선택 시 태그 */}
                            {isOn && (
                                <div style={{ marginTop: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {assessment.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '10px', padding: '2px 8px', borderRadius: '8px',
                                            background: assessment.bg, color: assessment.accent,
                                            border: `1px solid ${assessment.accent}30`,
                                        }}>
                      {tag}
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 선택 요약 + 시작 버튼 */}
            <div style={{
                background: '#fff', borderRadius: '12px',
                border: '1px solid #e5e7eb', padding: '18px 20px',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                            선택된 검사: {selected.length}개
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {selected.map(id => {
                                const a = ASSESSMENT_LIST.find(x => x.id === id);
                                return (
                                    <span key={id} style={{
                                        fontSize: '11px', padding: '3px 10px', borderRadius: '10px',
                                        background: a.bg, color: a.accent, fontWeight: 500,
                                        border: `1px solid ${a.accent}30`,
                                    }}>
                    {a.emoji} {a.shortName}
                  </span>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            총 {totalQ}문항 · 약 {totalMin}분 예상
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {selected.length > 1 ? '✨ 복수 검사 → 앙상블 통합 추천' : '단일 검사 진행'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 안내 + 시작 버튼 */}
            {selected.length > 1 && (
                <div style={{
                    background: '#eff6ff', borderRadius: '10px',
                    border: '1px solid #bfdbfe', padding: '12px 16px',
                    marginBottom: '16px', fontSize: '12px', color: '#1e40af', lineHeight: '1.6',
                }}>
                    💡 <strong>{selected.length}가지 검사</strong>를 모두 완료하면 각 검사 결과를
                    <strong> 가중 평균 앙상블 방식</strong>으로 통합해 더 정확한 직업을 추천합니다.
                </div>
            )}

            <button
                onClick={() => onConfirm(selected)}
                style={{
                    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                    background: '#1a365d', color: '#fff',
                    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e4a8a'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a365d'}
            >
                검사 시작하기 ({selected.length}개 선택) →
            </button>
        </div>
    );
};

export default AssessmentSelector;