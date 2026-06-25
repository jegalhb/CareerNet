// src/DeptSlider.jsx
import React, { useState, useEffect, useRef } from 'react';

const DUMMY_DEPTS = [
    {
        title: "화장품과학과",
        image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=400&auto=format&fit=crop",
        desc: "고부가가치 산업인 화장품 제조에 필요한 원료 개발, 제형 설계, 효능 평가 등 전 과정을 연구하는 학과입니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "높음" }, { label: "산업수요", value: "높음" }]
    },
    {
        title: "컴퓨터공학과 (소프트웨어 전공)",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop",
        desc: "IT 사회의 기반이 되는 하드웨어와 소프트웨어를 종합적으로 연구하며, 프로그래밍 및 시스템 설계 역량을 양성합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "매우높음" }, { label: "기술융합", value: "필수" }]
    },
    {
        title: "인공지능학과 (AI 전문)",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=400&auto=format&fit=crop",
        desc: "머신러닝, 딥러닝, 빅데이터 분석 등 AI 기술을 전문적으로 연구하고, 다양한 산업에 적용하는 역량을 양성합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "매우높음" }, { label: "학문혁신", value: "매우높음" }]
    },
    {
        title: "생명공학과 (바이오)",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
        desc: "생명체의 원리를 이해하고, 유전공학, 세포학 등을 활용하여 신약, 신소재, 환경보호 기술 등을 연구합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "높음" }, { label: "사회기여", value: "좋음" }]
    },
    {
        title: "반도체공학과 (시스템 반도체)",
        image: "https://images.unsplash.com/photo-1619641782842-83ff78f3f8da?q=80&w=400&auto=format&fit=crop",
        desc: "국가 핵심 산업인 반도체의 설계, 공정, 장비 등을 전문적으로 연구하며, 차세대 시스템 반도체 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "폭발적" }, { label: "기술혁신", value: "매우높음" }]
    },
    {
        title: "미래자동차공학과 (전기/자율)",
        image: "https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=400&auto=format&fit=crop",
        desc: "전기자동차, 자율주행 자동차 등 모빌리티 산업의 혁신을 이끌 전기/전자, 소프트웨어, 제어 기술을 연구합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "매우높음" }, { label: "산업영향", value: "폭발적" }]
    },
    {
        title: "신재생에너지공학과",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop",
        desc: "기후 위기에 대응하기 위해 태양광, 풍력, 수소 등 친환경 에너지원을 연구하고, 에너지 생산 효율을 높이는 기술을 개발합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "높음" }, { label: "환경보호", value: "매우좋음" }]
    },
    {
        title: "데이터사이언스학과",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
        desc: "복잡한 비즈니스 데이터에서 통계 및 머신러닝 기법을 활용해 인사이트를 도출하고 전략 수립을 돕는 전문가입니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "높음" }, { label: "분석역량", value: "필수" }]
    },
    {
        title: "게임공학과 (기획/개발)",
        image: "https://images.unsplash.com/photo-1580238053495-b96be0e3f130?q=80&w=400&auto=format&fit=crop",
        desc: "게임 콘텐츠의 스토리를 기획하고, 게임 엔진을 활용하여 소프트웨어를 구현하며 사용자에게 즐거운 경험을 제공합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "높음" }, { label: "창의성", value: "매우필요" }]
    },
    {
        title: "드론운용정비학과",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=400&auto=format&fit=crop",
        desc: "드론을 원격 조종하여 다양한 임무를 수행하거나 드론의 기체와 시스템을 유지보수하는 드론 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "좋음" }, { label: "사회활용", value: "매우좋음" }]
    },
    {
        title: "스마트팜학과 (농업IT)",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5c476?q=80&w=400&auto=format&fit=crop",
        desc: "농업에 IoT, AI 기술을 접목하여 작물의 생육 환경을 자동 제어하는 지능형 스마트 농장을 설계하고 구축하는 역량을 연구합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "높음" }, { label: "환경친화", value: "좋음" }]
    },
    {
        title: "사이버보안학과 (정보보호)",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop",
        desc: "기업의 정보 시스템을 외부의 해킹 공격으로부터 보호하고, 보안 취약점을 분석하여 대응 방안을 마련하는 기술 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "매우높음" }, { label: "사회안전", value: "매우좋음" }]
    },
    {
        title: "뉴미디어디자인학과 (영상)",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
        desc: "웹, 앱, 영상 등 디지털 콘텐츠의 시각적 요소를 설계하고, 사용자 중심의 인터페이스와 경험을 디자인합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "보통" }, { label: "창의성", value: "매우필요" }]
    },
    {
        title: "경영학과 (데이터기반)",
        image: "https://images.unsplash.com/photo-1460925895917-afdab027d52f?q=80&w=400&auto=format&fit=crop",
        desc: "기업의 효율적인 운영을 위해 인사, 재무, 마케팅 전략을 연구하며, 특히 데이터를 기반으로 합리적인 의사결정을 내리는 역량을 양성합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "높음" }, { label: "수요수용", value: "좋음" }]
    },
    {
        title: "심리학과 (상담심리)",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=400&auto=format&fit=crop",
        desc: "인간의 마음과 행동의 원리를 연구하며, 특히 상담 심리 역량을 양성하여 현대인의 정신 건강과 삶의 질 개선을 돕습니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "보통" }, { label: "사회기여", value: "높음" }]
    },
    {
        title: "로봇공학과 (제어/소프트)",
        image: "https://images.unsplash.com/photo-1581091215367-9b6c00b3035a?q=80&w=400&auto=format&fit=crop",
        desc: "인간을 돕는 로봇 시스템을 설계, 제작, 제어하며, 자율주행, 협동 로봇 등 최신 기술을 연구합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "높음" }, { label: "학문혁신", value: "매우높음" }]
    },
    {
        title: "간호학과",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=400&auto=format&fit=crop",
        desc: "질병을 예방하고 환자를 간호하며, 전 국민의 정신 건강과 사회 복지 수준을 높이는 데 기여하는 간호 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "폭발적" }, { label: "사회기여", value: "매우높음" }]
    },
    {
        title: "사회복지학과",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=400&auto=format&fit=crop",
        desc: "사회적 소외 계층을 지원하고, 모든 전 국민의 전반적인 삶의 질과 사회 안전망 수준을 높이는 데 기여하는 사회 복지 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "높음" }, { label: "취업률", value: "보통" }, { label: "사회기여", value: "높음" }]
    },
    {
        title: "식품영양학과 (푸드테크)",
        image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=400&auto=format&fit=crop",
        desc: "식품의 영양학적 특성을 연구하고, 푸드테크 기술을 접목하여 건강하고 기능성이 뛰어난 식품을 개발합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "보통" }, { label: "환경보호", value: "좋음" }]
    },
    {
        title: "재난안전공학과",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop",
        desc: "화재, 지진 등 각종 재난 사고를 예방하고, 재난 발생 시 빠르고 효과적인 대응 시스템을 설계하는 보안 전문가를 양성합니다.",
        stats: [{ label: "진학률", value: "보통" }, { label: "취업률", value: "높음" }, { label: "사회안전", value: "매우좋음" }]
    }
];

const DeptSlider = () => {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const timerRef = useRef(null);

    const handleImageError = (e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = 'https://placehold.co/400x260/e5e7eb/e11d48?text=Department+Image';
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setIndex((prev) => (prev + 1) % DUMMY_DEPTS.length);
            }, 4000); // 4초마다 슬라이딩
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying]);

    const handlePrev = () => setIndex((prev) => (prev - 1 + DUMMY_DEPTS.length) % DUMMY_DEPTS.length);
    const handleNext = () => setIndex((prev) => (prev + 1) % DUMMY_DEPTS.length);

    const currentDept = DUMMY_DEPTS[index];

    return (
        <div className="dept-slider-wrap ann-parent">
            <div className="slider-header">
                <span className="slider-title">학과정보</span>
                <div className="slider-controls">
                    <button className="slider-ctrl-btn" onClick={handlePrev}><i className="ti ti-chevron-left"></i></button>
                    <button className="slider-ctrl-btn" onClick={() => setIsPlaying(!isPlaying)}>
                        <i className={`ti ${isPlaying ? 'ti-player-pause' : 'ti-player-play'}`}></i>
                    </button>
                    <button className="slider-ctrl-btn" onClick={handleNext}><i className="ti ti-chevron-right"></i></button>
                </div>
            </div>

            <div className="info-slider-card">
                <div>
                    <div className="card-job-title" style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                        {currentDept.title}
                    </div>
                    <div className="card-top-split">
                        <div className="card-display-zone">
                            <img
                                src={currentDept.image}
                                alt={currentDept.title}
                                onError={handleImageError}
                            />
                        </div>
                        <div className="card-stats-zone">
                            {currentDept.stats.map((st, i) => (
                                <div className="stat-row" key={i}>
                                    <span className="stat-label">{st.label}</span>
                                    <span className="stat-value" style={{ color: '#e11d48' }}>{st.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="card-bottom-desc">{currentDept.desc}</p>
            </div>
        </div>
    );
};

export default DeptSlider;