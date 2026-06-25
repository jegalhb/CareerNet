// src/components/RoadmapCard.jsx
import React, { useState } from 'react';

const STEP_DATA = [
    { icon: 'ti-chart-bar', label: '진단', title: '진단 단계 — 할 일 목록', items: ['흥미검사(Holland) 완료하기', '강점 자기진단 작성하기', '진로 상담사와 결과 리뷰 신청'] },
    { icon: 'ti-briefcase', label: '직업선택', title: '직업선택 단계 — 할 일 목록', items: ['관심 직업 5개 이상 즐겨찾기 추가하기', '직업별 연봉 및 전망 비교표 작성', '흥미검사 결과와 연계 직업 확인', '현직자 멘토 1명 이상 연결 신청'] },
    { icon: 'ti-book', label: '역량강화', title: '역량강화 단계 — 할 일 목록', items: ['목표 직업 필수 스킬 3개 정리', '온라인 강의 수강 계획 수립', '포트폴리오 초안 작성 시작', '자격증 취득 일정 등록'] },
    { icon: 'ti-users', label: '멘토링', title: '멘토링 단계 — 할 일 목록', items: ['멘토 1:1 세션 1회 이상 완료', '현직자 일상 인터뷰 노트 작성', '네트워킹 이벤트 1회 참여'] },
    { icon: 'ti-trophy', label: '취업', title: '취업 단계 — 할 일 목록', items: ['이력서 및 포트폴리오 최종본 완성', '목표 기업 10곳 지원 목록 작성', '최종 면접 대비 모의 면접 실시'] }
];

const RoadmapCard = () => {
    const [activeStep, setActiveStep] = useState(1); // 기본값: 직업선택(1)
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);

    return (
        <div className="roadmap-card ann">
            <span className="ann-badge" style={{ top: '-10px', left: '10px' }}>④ 로드맵 → 마이페이지로 이동</span>
            <div className="section-header">
                <span className="section-title">내 진로 로드맵</span>
                <span className="section-more" style={{ color: 'var(--blue-600)', fontWeight: 500 }}>
          마이페이지에서 보기 <i className="ti ti-chevron-right" aria-hidden="true"></i>
        </span>
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

export default RoadmapCard;