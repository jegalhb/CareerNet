// src/components/career/ResultStep.jsx
import React, { useState } from 'react';
import { TYPE_INFO } from '../../data/assessmentData';
import { getMatchLabel } from '../../utils/hollandMatcher';
import { JOB_CATEGORIES } from '../../data/jobDatabase';

const ResultStep = ({ result, onSelectJob, onReset }) => {
    const { rankedTypes, percentScores, hollandCode, recommendations } = result;
    const [filterCategory, setFilterCategory] = useState('전체');

    const top3 = rankedTypes.slice(0, 3);
    const primaryType = rankedTypes[0];

    const filtered = filterCategory === '전체'
        ? recommendations
        : recommendations.filter((j) => j.category === filterCategory);

    // ── 간단한 레이더 차트 (SVG) ──
    const RadarChart = () => {
        const types = ['R', 'I', 'A', 'S', 'E', 'C'];
        const cx = 110, cy = 110, r = 90;
        const angleStep = (2 * Math.PI) / types.length;

        const getXY = (idx, radius) => ({
            x: cx + radius * Math.sin(idx * angleStep),
            y: cy - radius * Math.cos(idx * angleStep),
        });

        // 사용자 점수 폴리곤
        const userPoints = types.map((t, i) => {
            const score = percentScores[t] / 100;
            return getXY(i, r * score);
        });
        const polyStr = userPoints.map((p) => `${p.x},${p.y}`).join(' ');

        // 배경 격자 (20, 40, 60, 80, 100)
        const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

        return (
            <svg width="220" height="220" style={{ display: 'block', margin: '0 auto' }}>
                {/* 격자 */}
                {gridLevels.map((level) => {
                    const pts = types.map((_, i) => getXY(i, r * level));
                    return (
                        <polygon
                            key={level}
                            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                            fill="none" stroke="#e5e7eb" strokeWidth="1"
                        />
                    );
                })}

                {/* 축선 */}
                {types.map((_, i) => {
                    const outer = getXY(i, r);
                    return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="1" />;
                })}

                {/* 사용자 데이터 영역 */}
                <polygon
                    points={polyStr}
                    fill="rgba(26, 54, 93, 0.18)"
                    stroke="#1a365d"
                    strokeWidth="2"
                />

                {/* 점 */}
                {userPoints.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1a365d" />
                ))}

                {/* 레이블 */}
                {types.map((type, i) => {
                    const pos = getXY(i, r + 18);
                    const info = TYPE_INFO[type];
                    return (
                        <text key={type} x={pos.x} y={pos.y}
                              textAnchor="middle" dominantBaseline="middle"
                              fontSize="11" fontWeight="600"
                              fill={info.color}
                        >
                            {info.emoji} {type}
                        </text>
                    );
                })}
            </svg>
        );
    };

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* 결과 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                    검사 완료! 나의 Holland 코드
                </h2>
                <div style={{
                    display: 'inline-flex', gap: '4px', background: '#1a365d',
                    borderRadius: '12px', padding: '10px 20px',
                }}>
                    {hollandCode.split('').map((code, i) => (
                        <span key={i} style={{
                            fontSize: '22px', fontWeight: 800,
                            color: TYPE_INFO[code]?.color || '#fff',
                            letterSpacing: '2px',
                        }}>
              {code}
            </span>
                    ))}
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                    {top3.map((t) => TYPE_INFO[t.type].name).join(' · ')} 유형
                </p>
            </div>

            {/* 레이더 차트 + 점수 */}
            <div style={{
                display: 'grid', gridTemplateColumns: '240px 1fr',
                gap: '20px', background: '#fff',
                borderRadius: '14px', border: '1px solid #e5e7eb',
                padding: '20px', marginBottom: '20px',
                flexWrap: 'wrap',
            }}>
                <div>
                    <RadarChart />
                </div>

                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', marginBottom: '12px' }}>
                        유형별 점수
                    </h4>
                    {rankedTypes.map(({ type, score, rank }) => {
                        const info = TYPE_INFO[type];
                        return (
                            <div key={type} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: rank <= 3 ? 600 : 400, color: info.color }}>
                    {rank <= 3 && <span style={{ marginRight: '4px' }}>{'★'.repeat(4 - rank)}</span>}
                      {info.emoji} {type} · {info.name}
                  </span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: info.color }}>{score}점</span>
                                </div>
                                <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '6px' }}>
                                    <div style={{
                                        background: info.color, height: '6px',
                                        borderRadius: '999px', width: `${score}%`,
                                        transition: 'width 0.6s ease',
                                    }} />
                                </div>
                            </div>
                        );
                    })}

                    {/* 주유형 설명 */}
                    <div style={{
                        marginTop: '14px', background: primaryType ? TYPE_INFO[primaryType.type].color + '10' : '#f9fafb',
                        borderRadius: '8px', padding: '10px 12px',
                        border: `1px solid ${primaryType ? TYPE_INFO[primaryType.type].color + '30' : '#e5e7eb'}`,
                    }}>
                        <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                            <strong style={{ color: primaryType ? TYPE_INFO[primaryType.type].color : '#1a365d' }}>
                                주 유형: {primaryType ? TYPE_INFO[primaryType.type].name : ""}
                            </strong><br />
                            {primaryType && TYPE_INFO[primaryType.type].desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* 직업 추천 섹션 */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a365d', margin: 0 }}>
                        🎯 맞춤 직업 추천 ({filtered.length}개)
                    </h3>
                    <button onClick={onReset} style={{
                        fontSize: '12px', color: '#6b7280',
                        background: 'none', border: '1px solid #e5e7eb',
                        borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                    }}>
                        ↺ 다시 검사
                    </button>
                </div>

                {/* 카테고리 필터 */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {['전체', ...new Set(recommendations.map((j) => j.category))].map((cat) => (
                        <button key={cat} onClick={() => setFilterCategory(cat)} style={{
                            padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                            border: filterCategory === cat ? 'none' : '1px solid #e5e7eb',
                            background: filterCategory === cat ? '#1a365d' : '#fff',
                            color: filterCategory === cat ? '#fff' : '#6b7280',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 직업 카드 리스트 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.map((job, idx) => {
                        const matchInfo = getMatchLabel(job.matchScore);
                        return (
                            <div key={job.id} style={{
                                background: '#fff', borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                padding: '16px 18px',
                                display: 'flex', alignItems: 'center', gap: '14px',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                                 onClick={() => onSelectJob(job)}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.borderColor = '#1a365d';
                                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,54,93,0.1)';
                                     e.currentTarget.style.transform = 'translateY(-1px)';
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.borderColor = '#e5e7eb';
                                     e.currentTarget.style.boxShadow = 'none';
                                     e.currentTarget.style.transform = 'none';
                                 }}
                            >
                                {/* 순위 */}
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: idx < 3 ? '#1a365d' : '#f3f4f6',
                                    color: idx < 3 ? '#fff' : '#6b7280',
                                    fontSize: '12px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {idx + 1}
                                </div>

                                {/* 이모지 */}
                                <div style={{ fontSize: '28px', flexShrink: 0 }}>{job.emoji}</div>

                                {/* 정보 */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {job.title}
                    </span>
                                        <span style={{
                                            fontSize: '10px', padding: '2px 7px', borderRadius: '8px',
                                            background: '#f3f4f6', color: '#6b7280',
                                        }}>
                      {job.category}
                    </span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.4,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {job.desc}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                        {job.keySkills.slice(0, 3).map((s) => (
                                            <span key={s} style={{
                                                fontSize: '10px', background: '#eff6ff', color: '#1e40af',
                                                padding: '2px 7px', borderRadius: '6px',
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* 적합도 + 연봉 */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{
                                        fontSize: '13px', fontWeight: 700,
                                        background: matchInfo.bg, color: matchInfo.color,
                                        padding: '4px 10px', borderRadius: '20px', marginBottom: '4px',
                                    }}>
                                        {job.matchScore}% {matchInfo.label}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{job.avgSalary}</div>
                                    <div style={{ fontSize: '11px', color: job.outlook === 'up' ? '#059669' : '#6b7280', marginTop: '2px' }}>
                                        {job.outlookLabel}
                                    </div>
                                </div>

                                <span style={{ fontSize: '16px', color: '#9ca3af', flexShrink: 0 }}>›</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResultStep;