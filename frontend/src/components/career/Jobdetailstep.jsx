// src/components/career/JobDetailStep.jsx
import React, { useState } from 'react';
import { getMatchLabel } from '../../utils/Hollandmatcher.js';
import { TYPE_INFO } from '../../data/assessmentData';

const JobDetailStep = ({ job, assessmentResult, onBack, onReset }) => {
    const [tab, setTab] = useState('overview'); // 'overview' | 'roadmap' | 'mentor'
    const matchInfo = getMatchLabel(job.matchScore);

    const TABS = [
        { id: 'overview', label: '직업 개요' },
        { id: 'roadmap',  label: '진로 로드맵' },
        { id: 'mentor',   label: '현직자 멘토' },
    ];

    const mentorVisual = {
        mentorImage: job.mentorImage || null,
        jobImage: job.jobImage || null,
        videoThumbnail: job.videoThumbnail || null,
        mentorOneLine:
            job.mentorOneLine ||
            `${job.title}은 문제를 발견하고, 필요한 역량을 활용해 실제 결과를 만들어내는 직무입니다.`,
        videoTitle: job.videoTitle || `${job.title} 실무 현장 미리보기`,
    };

    const mentorPrograms = [
        {
            icon: '❓',
            title: `${job.title} 실무 Q&A`,
            desc: '현직자에게 직무, 취업 준비, 실무 흐름을 직접 질문해보세요.',
        },
        {
            icon: '📁',
            title: '포트폴리오 리뷰',
            desc: '지원 직무에 맞춰 프로젝트와 경험을 어떻게 보여줄지 피드백받습니다.',
        },
        {
            icon: '🧭',
            title: '1:1 커리어 코칭',
            desc: '학습 방향, 전공 선택, 취업 준비 순서를 개인별로 점검합니다.',
        },
    ];

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* 뒤로가기 */}
            <button onClick={onBack} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none', color: '#6b7280',
                fontSize: '13px', cursor: 'pointer', marginBottom: '16px', padding: 0,
            }}>
                ← 결과 목록으로
            </button>

            {/* 직업 헤더 카드 */}
            <div style={{
                background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                borderRadius: '14px', padding: '24px', marginBottom: '16px',
                color: '#fff',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '52px' }}>{job.emoji}</span>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
                                {job.title}
                            </h2>
                            <span style={{
                                fontSize: '10px', background: 'rgba(255,255,255,0.2)',
                                padding: '3px 8px', borderRadius: '8px', color: 'rgba(255,255,255,0.9)',
                            }}>
                {job.category}
              </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {job.hollandCodes.map((code) => (
                                <span key={code} style={{
                                    fontSize: '11px',
                                    background: TYPE_INFO[code]?.color + '40',
                                    color: '#fff', padding: '2px 8px', borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}>
                  {TYPE_INFO[code]?.emoji} {TYPE_INFO[code]?.name}
                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 주요 수치 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {job.highlights.map((h, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: '10px', padding: '12px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                                {h.label}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                                {h.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 적합도 표시 */}
                {job.matchScore && (
                    <div style={{
                        marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: '999px', height: '6px', flex: 1,
                        }}>
                            <div style={{
                                background: '#fff', height: '6px', borderRadius: '999px',
                                width: `${job.matchScore}%`, transition: 'width 0.8s ease',
                            }} />
                        </div>
                        <span style={{
                            fontSize: '12px', fontWeight: 700,
                            background: matchInfo.bg, color: matchInfo.color,
                            padding: '3px 10px', borderRadius: '12px',
                        }}>
              나와의 적합도 {job.matchScore}%
            </span>
                    </div>
                )}
            </div>

            {/* 탭 네비게이션 */}
            <div style={{
                display: 'flex', gap: 0,
                borderBottom: '2px solid #e5e7eb', marginBottom: '20px',
                background: '#fff', borderRadius: '12px 12px 0 0',
            }}>
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        flex: 1, padding: '12px 8px', border: 'none',
                        background: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: tab === t.id ? 700 : 400,
                        color: tab === t.id ? '#1a365d' : '#6b7280',
                        borderBottom: tab === t.id ? '2px solid #1a365d' : '2px solid transparent',
                        marginBottom: '-2px', transition: 'all 0.15s',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* 탭 콘텐츠 */}
            {tab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* 직업 설명 */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '18px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', margin: '0 0 10px' }}>
                            📋 직업 소개
                        </h4>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                            {job.desc}
                        </p>
                    </div>

                    {/* 근무 환경 */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '18px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', margin: '0 0 10px' }}>
                            🏢 근무 환경
                        </h4>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                            {job.workEnv}
                        </p>
                    </div>

                    {/* 핵심 스킬 */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '18px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', margin: '0 0 12px' }}>
                            🛠 핵심 스킬
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {job.keySkills.map((skill) => (
                                <span key={skill} style={{
                                    fontSize: '12px', background: '#eff6ff', color: '#1e40af',
                                    padding: '5px 12px', borderRadius: '20px',
                                    border: '1px solid #bfdbfe',
                                }}>
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* 관련 전공 */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '18px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', margin: '0 0 12px' }}>
                            🎓 관련 전공
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {job.requiredMajors.map((major) => (
                                <span key={major} style={{
                                    fontSize: '12px', background: '#f0fdf4', color: '#166534',
                                    padding: '5px 12px', borderRadius: '20px',
                                    border: '1px solid #bbf7d0',
                                }}>
                  {major}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* 나의 적합도 분석 */}
                    {assessmentResult && (
                        <div style={{
                            background: '#eff6ff', borderRadius: '12px',
                            border: '1px solid #bfdbfe', padding: '18px',
                        }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', margin: '0 0 10px' }}>
                                📊 나와의 적합도 분석
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {job.hollandCodes.map((code, i) => {
                                    const score = assessmentResult.percentScores[code] || 0;
                                    const weight = ['핵심', '보조', '참고'][i] || '참고';
                                    const info = TYPE_INFO[code];
                                    return (
                                        <div key={code}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: info.color, fontWeight: 500 }}>
                          {info.emoji} {info.name} ({weight} 유형)
                        </span>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: info.color }}>{score}점</span>
                                            </div>
                                            <div style={{ background: '#dbeafe', borderRadius: '999px', height: '5px' }}>
                                                <div style={{
                                                    background: info.color, height: '5px', borderRadius: '999px',
                                                    width: `${score}%`,
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tab === 'roadmap' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a365d', margin: '0 0 4px' }}>
                            🗺️ {job.title} 진로 로드맵
                        </h4>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 18px' }}>
                            {job.growthPath}
                        </p>

                        {/* 스텝 타임라인 */}
                        {job.roadmapSteps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: idx < job.roadmapSteps.length - 1 ? '0' : '0' }}>
                                {/* 왼쪽 스텝 번호 + 연결선 */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: '#1a365d', color: '#fff',
                                        fontSize: '13px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {idx + 1}
                                    </div>
                                    {idx < job.roadmapSteps.length - 1 && (
                                        <div style={{ width: '2px', flex: 1, minHeight: '24px', background: '#e5e7eb', margin: '4px 0' }} />
                                    )}
                                </div>

                                {/* 스텝 내용 */}
                                <div style={{ paddingBottom: idx < job.roadmapSteps.length - 1 ? '16px' : 0, paddingTop: '6px' }}>
                                    <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>{step}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 로드맵 추가 CTA */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1a365d, #2563eb)',
                        borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#fff',
                    }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                            이 직업 로드맵을 내 진로 계획에 추가할까요?
                        </p>
                        <button style={{
                            background: '#fff', color: '#1a365d',
                            border: 'none', borderRadius: '8px',
                            padding: '10px 24px', fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                        }}>
                            + 내 로드맵에 추가하기
                        </button>
                    </div>
                </div>
            )}

            {tab === 'mentor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 현직자 멘토 메인 카드 */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        boxShadow: '0 10px 28px rgba(15,23,42,0.07)',
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1.05fr 0.95fr',
                            minHeight: '280px',
                        }}>
                            {/* 좌측: 직업 이미지/비주얼 */}
                            <div style={{
                                position: 'relative',
                                padding: '26px',
                                color: '#fff',
                                backgroundImage: mentorVisual.jobImage
                                    ? `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.7)), url(${mentorVisual.jobImage})`
                                    : 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>
                                {!mentorVisual.jobImage && (
                                    <>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-44px',
                                            right: '-34px',
                                            width: '170px',
                                            height: '170px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.08)',
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            right: '28px',
                                            bottom: '22px',
                                            fontSize: '92px',
                                            opacity: 0.2,
                                        }}>
                                            {job.emoji}
                                        </div>
                                    </>
                                )}

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: '#dbeafe',
                                        background: 'rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(255,255,255,0.22)',
                                        borderRadius: '999px',
                                        padding: '5px 12px',
                                        marginBottom: '16px',
                                    }}>
                                        🎙 현직자 인터뷰
                                    </span>

                                    <h3 style={{
                                        fontSize: '23px',
                                        lineHeight: 1.35,
                                        letterSpacing: '-0.4px',
                                        color: '#fff',
                                        margin: '0 0 10px',
                                    }}>
                                        {job.title} 실무자가 들려주는<br />
                                        현장의 이야기
                                    </h3>

                                    <p style={{
                                        fontSize: '13px',
                                        lineHeight: 1.7,
                                        color: 'rgba(255,255,255,0.78)',
                                        margin: 0,
                                        maxWidth: '390px',
                                    }}>
                                        직무의 실제 업무 흐름, 필요한 역량, 준비 방법을 현직자 관점에서 이해할 수 있습니다.
                                    </p>
                                </div>

                                <div style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap',
                                    marginTop: '24px',
                                }}>
                                    {(job.keySkills || []).slice(0, 4).map((skill) => (
                                        <span key={skill} style={{
                                            fontSize: '11px',
                                            color: '#fff',
                                            background: 'rgba(255,255,255,0.15)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '999px',
                                            padding: '5px 10px',
                                        }}>
                                            #{skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 우측: 멘토 프로필 */}
                            <div style={{
                                padding: '26px',
                                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    marginBottom: '18px',
                                }}>
                                    <div style={{
                                        width: '74px',
                                        height: '74px',
                                        borderRadius: '24px',
                                        backgroundImage: mentorVisual.mentorImage
                                            ? `url(${mentorVisual.mentorImage})`
                                            : 'linear-gradient(135deg, #1a365d, #2563eb)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: '#fff',
                                        fontSize: '26px',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: '0 10px 24px rgba(37,99,235,0.22)',
                                    }}>
                                        {!mentorVisual.mentorImage && (job.mentorName?.slice(0, 1) || '?')}
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '17px',
                                            fontWeight: 800,
                                            color: '#111827',
                                            marginBottom: '4px',
                                        }}>
                                            {job.mentorName || '현직자 멘토'}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#2563eb',
                                            fontWeight: 700,
                                            lineHeight: 1.5,
                                        }}>
                                            {job.mentorRole || `${job.title} 현직자`}
                                        </div>
                                    </div>
                                </div>

                                <blockquote style={{
                                    margin: 0,
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '14px',
                                    padding: '16px',
                                }}>
                                    <div style={{
                                        fontSize: '26px',
                                        lineHeight: 1,
                                        color: '#2563eb',
                                        marginBottom: '5px',
                                    }}>
                                        “
                                    </div>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#1f2937',
                                        lineHeight: 1.7,
                                        fontWeight: 700,
                                        margin: 0,
                                    }}>
                                        {job.mentorQuote || mentorVisual.mentorOneLine}
                                    </p>
                                </blockquote>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '8px',
                                    marginTop: '16px',
                                }}>
                                    {[
                                        { icon: '💼', label: '직무', value: '실무 중심' },
                                        { icon: '🎯', label: '초점', value: '취업 준비' },
                                        { icon: '📌', label: '방식', value: '로드맵형' },
                                    ].map((item) => (
                                        <div key={item.label} style={{
                                            background: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '10px',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: '17px', marginBottom: '3px' }}>{item.icon}</div>
                                            <div style={{ fontSize: '10px', color: '#9ca3af' }}>{item.label}</div>
                                            <div style={{ fontSize: '11px', color: '#111827', fontWeight: 800 }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 영상 + 한줄평 섹션 */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.05fr 0.95fr',
                        gap: '14px',
                    }}>
                        {/* 영상 카드 */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '14px',
                            border: '1px solid #e5e7eb',
                            padding: '18px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px',
                            }}>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#1a365d',
                                    margin: 0,
                                }}>
                                    🎬 직업 관련 영상
                                </h4>
                                <span style={{
                                    fontSize: '10px',
                                    color: '#2563eb',
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '999px',
                                    padding: '3px 8px',
                                    fontWeight: 700,
                                }}>
                                    실무 미리보기
                                </span>
                            </div>

                            <div style={{
                                height: '220px',
                                borderRadius: '12px',
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundImage: mentorVisual.videoThumbnail
                                    ? `linear-gradient(rgba(15,23,42,0.18), rgba(15,23,42,0.62)), url(${mentorVisual.videoThumbnail})`
                                    : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                marginBottom: '12px',
                            }}>
                                {!mentorVisual.videoThumbnail && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '18px',
                                        top: '16px',
                                        fontSize: '46px',
                                        opacity: 0.28,
                                    }}>
                                        {job.emoji}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (job.videoUrl) {
                                            window.open(job.videoUrl, '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255,255,255,0.34)',
                                        background: 'rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        fontSize: '23px',
                                        cursor: job.videoUrl ? 'pointer' : 'default',
                                        backdropFilter: 'blur(8px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    title={job.videoUrl ? '영상 보기' : '준비 중인 영상입니다'}
                                >
                                    ▶
                                </button>

                                <div style={{
                                    position: 'absolute',
                                    left: '18px',
                                    right: '18px',
                                    bottom: '16px',
                                    zIndex: 1,
                                }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: 800,
                                        color: '#fff',
                                        marginBottom: '4px',
                                    }}>
                                        {mentorVisual.videoTitle}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.72)',
                                    }}>
                                        {job.videoUrl ? '클릭하면 관련 영상을 새 창에서 볼 수 있습니다.' : '관련 영상 콘텐츠를 준비 중입니다.'}
                                    </div>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                lineHeight: 1.65,
                                margin: 0,
                            }}>
                                영상 콘텐츠를 통해 {job.title}의 실제 업무 장면, 협업 방식, 사용하는 도구를 더 쉽게 이해할 수 있습니다.
                            </p>
                        </div>

                        {/* 한줄평 + 이미지 키워드 */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                        }}>
                            <div style={{
                                background: '#fff',
                                borderRadius: '14px',
                                border: '1px solid #e5e7eb',
                                padding: '18px',
                                flex: 1,
                            }}>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#1a365d',
                                    margin: '0 0 12px',
                                }}>
                                    💬 직무 한줄평
                                </h4>

                                <div style={{
                                    background: 'linear-gradient(135deg, #eff6ff, #f8fafc)',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '14px',
                                    padding: '16px',
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#1f2937',
                                        lineHeight: 1.7,
                                        margin: 0,
                                        fontWeight: 800,
                                    }}>
                                        “{mentorVisual.mentorOneLine}”
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                background: '#fff',
                                borderRadius: '14px',
                                border: '1px solid #e5e7eb',
                                padding: '18px',
                                flex: 1,
                            }}>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#1a365d',
                                    margin: '0 0 12px',
                                }}>
                                    🖼 직무 이미지 키워드
                                </h4>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '8px',
                                }}>
                                    {[
                                        { icon: '🧩', label: '문제 해결' },
                                        { icon: '🤝', label: '협업' },
                                        { icon: '📊', label: '성과 관리' },
                                        { icon: '🚀', label: '성장 가능성' },
                                    ].map((item) => (
                                        <div key={item.label} style={{
                                            background: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>
                                                {item.icon}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#374151',
                                                fontWeight: 800,
                                            }}>
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 실무 포인트 */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '14px',
                        border: '1px solid #e5e7eb',
                        padding: '20px',
                    }}>
                        <h4 style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#1a365d',
                            margin: '0 0 14px',
                        }}>
                            ✨ 실무자가 알려주는 핵심 포인트
                        </h4>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                        }}>
                            {[
                                {
                                    icon: '📌',
                                    title: '주요 업무',
                                    desc: job.desc,
                                },
                                {
                                    icon: '🛠',
                                    title: '필요 역량',
                                    desc: `${(job.keySkills || []).slice(0, 3).join(', ')} 역량이 중요합니다.`,
                                },
                                {
                                    icon: '🎓',
                                    title: '준비 방법',
                                    desc: `${(job.requiredMajors || []).slice(0, 2).join(', ')} 관련 학습과 프로젝트 경험을 함께 쌓아보세요.`,
                                },
                            ].map((point) => (
                                <div key={point.title} style={{
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '14px',
                                    padding: '16px',
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: '#eff6ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        marginBottom: '10px',
                                    }}>
                                        {point.icon}
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: 800,
                                        color: '#111827',
                                        marginBottom: '7px',
                                    }}>
                                        {point.title}
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}>
                                        {point.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 멘토링 프로그램 */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '14px',
                        border: '1px solid #e5e7eb',
                        padding: '20px',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            gap: '12px',
                            marginBottom: '14px',
                        }}>
                            <div>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: '#1a365d',
                                    margin: '0 0 4px',
                                }}>
                                    🤝 관련 멘토링 프로그램
                                </h4>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    margin: 0,
                                }}>
                                    관심 있는 프로그램을 선택해 실무자와 더 깊게 연결해보세요.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                        }}>
                            {mentorPrograms.map((program) => (
                                <div key={program.title} style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '14px',
                                    padding: '15px',
                                    background: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}>
                                    <div style={{ fontSize: '24px' }}>{program.icon}</div>
                                    <div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#111827',
                                            fontWeight: 800,
                                            marginBottom: '4px',
                                        }}>
                                            {program.title}
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#6b7280',
                                            lineHeight: 1.5,
                                        }}>
                                            {program.desc}
                                        </div>
                                    </div>
                                    <button style={{
                                        marginTop: 'auto',
                                        fontSize: '12px',
                                        padding: '8px 10px',
                                        borderRadius: '8px',
                                        background: '#1a365d',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                    }}>
                                        신청하기
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={onBack} style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: '1.5px solid #e5e7eb', background: '#fff',
                    color: '#4b5563', fontSize: '13px', cursor: 'pointer',
                }}>
                    ← 다른 직업 보기
                </button>
                </div>
        </div>
    )
    }

export default JobDetailStep;