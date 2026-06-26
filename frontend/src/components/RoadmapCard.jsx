// src/components/RoadmapCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Useauth.jsx';

const STEP_DATA = [
    { icon: 'ti-chart-bar', label: '진단', title: '진단 단계 — 할 일 목록', items: ['흥미검사(Holland) 완료하기', '강점 자기진단 작성하기', '진로 상담사와 결과 리뷰 신청'] },
    { icon: 'ti-briefcase', label: '직업선택', title: '직업선택 단계 — 할 일 목록', items: ['관심 직업 5개 이상 즐겨찾기 추가하기', '직업별 연봉 및 전망 비교표 작성', '흥미검사 결과와 연계 직업 확인', '현직자 멘토 1명 이상 연결 신청'] },
    { icon: 'ti-book', label: '역량강화', title: '역량강화 단계 — 할 일 목록', items: ['목표 직업 필수 스킬 3개 정리', '온라인 강의 수강 계획 수립', '포트폴리오 초안 작성 시작', '자격증 취득 일정 등록'] },
    { icon: 'ti-users', label: '멘토링', title: '멘토링 단계 — 할 일 목록', items: ['멘토 1:1 세션 1회 이상 완료', '현직자 일상 인터뷰 노트 작성', '네트워킹 이벤트 1회 참여'] },
    { icon: 'ti-trophy', label: '취업', title: '취업 단계 — 할 일 목록', items: ['이력서 및 포트폴리오 최종본 완성', '목표 기업 10곳 지원 목록 작성', '최종 면접 대비 모의 면접 실시'] }
];

const RoadmapCard = () => {
    const { isLoggedIn, authLoading, user } = useAuth();
    const [activeStep, setActiveStep] = useState(1); // 기본값: 직업선택(1)
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);

    if (authLoading) {
        return (
            <div className="roadmap-card">
                <div className="section-header">
                    <span className="section-title">진로 로드맵</span>
                </div>
                <div style={{
                    height: '150px',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6)',
                }} />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <GuestRoadmapCard />;
    }

    return (
        <div className="roadmap-card ann">
            <div className="section-header">
                <span className="section-title">{user?.userNm || '나'}님의 진로 로드맵</span>
                <Link to="/mypage/roadmap" className="section-more" style={{ color: 'var(--blue-600)', fontWeight: 500, textDecoration: 'none' }}>
          마이페이지에서 보기 <i className="ti ti-chevron-right" aria-hidden="true"></i>
        </Link>
            </div>

            {/* Stepper Grid */}
            <div className="steps">
                {STEP_DATA.map((step, index) => {
                    let stepClass = "step";
                    if (index < activeStep) stepClass += " done";
                    if (index === activeStep) stepClass += " active";

                    return (
                        <div key={index} className={stepClass} onClick={() => { setActiveStep(index); setIsAccordionOpen(true); }}>
                            <div className="step-circle"><i className={`ti ${step.icon}`} aria-hidden="true"></i></div>
                            {index === activeStep && <span className="step-badge">진행중</span>}
                            <span className="step-label">{step.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Checklist Accordion */}
            {isAccordionOpen && (
                <div className="accordion">
                    <div className="acc-header">
                        <span className="acc-title">{STEP_DATA[activeStep].title}</span>
                        <span className="acc-close" onClick={() => setIsAccordionOpen(false)}>
              <i className="ti ti-x" aria-hidden="true"></i>
            </span>
                    </div>
                    <div className="checklist">
                        {STEP_DATA[activeStep].items.map((item, idx) => (
                            <div className="check-item" key={idx}>
                                <input type="checkbox" id={`step-check-${activeStep}-${idx}`} />
                                <label htmlFor={`step-check-${activeStep}-${idx}`}>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const GuestRoadmapCard = () => (
    <div className="roadmap-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            minHeight: '250px',
        }}>
            <div style={{ padding: '28px' }}>
                <div className="section-header" style={{ marginBottom: '10px' }}>
                    <span className="section-title">개인 진로 로드맵을 시작해보세요</span>
                </div>
                <p style={{
                    color: '#4b5563',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    margin: '0 0 18px',
                    maxWidth: '560px',
                }}>
                    로그인 후 진로 검사를 완료하면 진단, 직업 선택, 역량 강화, 멘토링, 취업 준비 단계를
                    내 상황에 맞춰 이어서 관리할 수 있습니다.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '10px',
                    marginBottom: '20px',
                }}>
                    {[
                        ['검사 결과 저장', 'Holland 유형과 추천 직업을 보관'],
                        ['관심 직업 관리', '탐색한 직업을 다시 확인'],
                        ['멘토링 연결', '현직자 상담 신청 내역 관리'],
                    ].map(([title, desc]) => (
                        <div key={title} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '13px',
                            background: '#f9fafb',
                        }}>
                            <div style={{ color: '#1a365d', fontSize: '13px', fontWeight: 800, marginBottom: '5px' }}>
                                {title}
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '11px', lineHeight: 1.5 }}>
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to="/design" style={primaryActionStyle}>진로 검사 시작</Link>
                    <Link to="/signup" style={secondaryActionStyle}>회원가입</Link>
                </div>
            </div>

            <div style={{
                minHeight: '250px',
                backgroundImage: 'linear-gradient(rgba(26,54,93,0.08), rgba(26,54,93,0.18)), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />
        </div>
    </div>
);

const primaryActionStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: '#1a365d',
    color: '#fff',
    padding: '10px 15px',
    fontSize: '13px',
    fontWeight: 800,
    textDecoration: 'none',
};

const secondaryActionStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: '#fff',
    color: '#1a365d',
    border: '1px solid #bfdbfe',
    padding: '10px 15px',
    fontSize: '13px',
    fontWeight: 800,
    textDecoration: 'none',
};

export default RoadmapCard;
