// src/JobSlider.jsx
import React, { useState, useEffect, useRef } from 'react';

const DUMMY_JOBS = [
    {
        title: "UX 디자인 컨설턴트",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400&auto=format&fit=crop",
        desc: "사용자의 마음과 행동에 대한 이해를 바탕으로 제품의 편리성과 만족도를 극대화하는 설계 전문가입니다.",
        stats: [{ label: "평균연봉", value: "좋음" }, { label: "일자리전망", value: "매우좋음" }, { label: "사회공헌", value: "좋음" }]
    },
    {
        title: "AI 엔지니어 (머신러닝 전문)",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=400&auto=format&fit=crop",
        desc: "인공지능 모델을 개발하고, 대규모 데이터를 학습시켜 자동화 및 예측 서비스를 구축하는 기술 전문가입니다.",
        stats: [{ label: "평균연봉", value: "매우높음" }, { label: "일자리전망", value: "폭발적" }, { label: "기술융합", value: "필수" }]
    },
    {
        title: "프론트엔드 개발자 (React)",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop",
        desc: "웹사이트의 사용자 화면을 구현하고, 백엔드 서버와 데이터를 주고받아 동적인 웹 앱을 만드는 개발자입니다.",
        stats: [{ label: "평균연봉", value: "좋음" }, { label: "일자리전망", value: "매우좋음" }, { label: "개발수요", value: "매우높음" }]
    },
    {
        title: "데이터 사이언티스트",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
        desc: "복잡한 비즈니스 데이터에서 통계 및 머신러닝 기법을 활용해 인사이트를 도출하고 전략 수립을 돕는 전문가입니다.",
        stats: [{ label: "평균연봉", value: "매우높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "수학적역량", value: "필수" }]
    },
    {
        title: "사이버 보안 분석가",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop",
        desc: "기업의 정보 시스템을 외부의 해킹 공격으로부터 보호하고, 보안 취약점을 분석하여 대응 방안을 마련합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "사회안전", value: "매우좋음" }]
    },
    {
        title: "로봇공학 기술자",
        image: "https://images.unsplash.com/photo-1581091215367-9b6c00b3035a?q=80&w=400&auto=format&fit=crop",
        desc: "산업용 로봇이나 자율주행 로봇 등 인간을 돕는 로봇 시스템을 설계, 제작, 제어하는 공학 전문가입니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "좋음" }, { label: "기술혁신", value: "매우좋음" }]
    },
    {
        title: "신재생 에너지 전문가",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop",
        desc: "태양광, 풍력, 수소 등 친환경 에너지원을 개발하고 생산 시스템을 효율화하여 기후 위기에 대응합니다.",
        stats: [{ label: "평균연봉", value: "좋음" }, { label: "일자리전망", value: "매우좋음" }, { label: "환경보호", value: "매우좋음" }]
    },
    {
        title: "게임 기획자",
        image: "https://images.unsplash.com/photo-1580238053495-b96be0e3f130?q=80&w=400&auto=format&fit=crop",
        desc: "게임의 스토리를 구성하고, 시스템 룰, 밸런싱 등을 기획하여 사용자에게 즐거운 경험을 제공하는 창작자입니다.",
        stats: [{ label: "평균연봉", value: "보통" }, { label: "일자리전망", value: "좋음" }, { label: "창의성", value: "매우필요" }]
    },
    {
        title: "클라우드 아키텍트",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop",
        desc: "기업의 IT 시스템을 AWS, Azure 같은 클라우드 환경으로 설계하고 운영 전략을 수립하는 클라우드 전문가입니다.",
        stats: [{ label: "평균연봉", value: "매우높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "기술역량", value: "매우높음" }]
    },
    {
        title: "콘텐츠 크리에이터 (유튜버)",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
        desc: "영상 플랫폼에서 자신만의 창의적인 콘텐츠를 제작, 업로드하여 팬덤을 형성하고 수익을 창출하는 창작자입니다.",
        stats: [{ label: "평균연봉", value: "편차큼" }, { label: "일자리전망", value: "좋음" }, { label: "사회영향", value: "높음" }]
    },
    {
        title: "디지털 마케터",
        image: "https://images.unsplash.com/photo-1460925895917-afdab027d52f?q=80&w=400&auto=format&fit=crop",
        desc: "온라인 채널(SNS, 검색 등)을 활용하여 기업의 제품이나 브랜드를 홍보하고, 데이터 기반 마케팅 전략을 수행합니다.",
        stats: [{ label: "평균연봉", value: "보통" }, { label: "일자리전망", value: "매우좋음" }, { label: "분석역량", value: "필요" }]
    },
    {
        title: "생명공학 연구원",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
        desc: "생명체의 원리를 연구하여 신약 개발, 질병 치료, 신소재 개발 등 인류의 삶을 개선하는 연구 전문가입니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "좋음" }, { label: "기술혁신", value: "매우높음" }]
    },
    {
        title: "핀테크 개발자",
        image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=400&auto=format&fit=crop",
        desc: "금융과 IT가 결합된 서비스(간편결제, 자산관리, 블록체인 등)를 개발하고 운영하는 금융 IT 전문 개발자입니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "기술융합", value: "매우높음" }]
    },
    {
        title: "자율주행 소프트웨어 개발자",
        image: "https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=400&auto=format&fit=crop",
        desc: "자동차가 스스로 주변 환경을 인식하고 판단하여 주행할 수 있도록 하는 제어 및 인지 소프트웨어를 개발합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "기술혁신", value: "폭발적" }]
    },
    {
        title: "VR/AR 콘텐츠 개발자",
        image: "https://images.unsplash.com/photo-1478416876543-980635c8a9c3?q=80&w=400&auto=format&fit=crop",
        desc: "가상현실(VR) 및 증강현실(AR) 기술을 활용하여 교육, 게임, 산업용 시뮬레이션 등 실감형 콘텐츠를 제작합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "좋음" }, { label: "창의성", value: "매우필요" }]
    },
    {
        title: "로보어드바이저 개발자",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop",
        desc: "인공지능 알고리즘을 기반으로 사용자의 자산 상황을 분석하여 자동으로 투자를 관리해주는 기술 서비스를 개발합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "좋음" }, { label: "금융역량", value: "매우필요" }]
    },
    {
        title: "드론 조종사 및 정비사",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=400&auto=format&fit=crop",
        desc: "드론을 원격으로 조종하여 촬영, 배송, 방제 등을 수행하거나 드론의 기체와 부품을 유지보수하는 전문가입니다.",
        stats: [{ label: "평균연봉", value: "보통" }, { label: "일자리전망", value: "좋음" }, { label: "사회활용", value: "매우좋음" }]
    },
    {
        title: "스마트팜 구축 전문가",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5c476?q=80&w=400&auto=format&fit=crop",
        desc: "농업에 IoT, AI 기술을 접목하여 작물의 생육 환경을 자동 제어하는 지능형 스마트 농장을 설계하고 구축합니다.",
        stats: [{ label: "평균연봉", value: "좋음" }, { label: "일자리전망", value: "매우좋음" }, { label: "환경친화", value: "좋음" }]
    },
    {
        title: "블록체인 개발자",
        image: "https://images.unsplash.com/photo-1621501602164-90407a82c42d?q=80&w=400&auto=format&fit=crop",
        desc: "데이터의 투명성과 보안성을 보장하는 블록체인 네트워크를 설계하고, 스마트 컨트랙트 기반 앱을 개발합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "좋음" }, { label: "기술혁신", value: "매우높음" }]
    },
    {
        title: "전기자동차 배터리 연구원",
        image: "https://images.unsplash.com/photo-1619641782842-83ff78f3f8da?q=80&w=400&auto=format&fit=crop",
        desc: "전기자동차의 핵심 부품인 이차전지(배터리)의 성능, 수명, 안전성을 개선하는 소재 및 셀 연구를 수행합니다.",
        stats: [{ label: "평균연봉", value: "높음" }, { label: "일자리전망", value: "매우좋음" }, { label: "산업영향", value: "폭발적" }]
    }
];

const JobSlider = () => {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const timerRef = useRef(null);

    const handleImageError = (e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = 'https://placehold.co/400x260/e5e7eb/1a365d?text=Career+Image';
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setIndex((prev) => (prev + 1) % DUMMY_JOBS.length);
            }, 4000); // 4초마다 슬라이딩
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying]);

    const handlePrev = () => setIndex((prev) => (prev - 1 + DUMMY_JOBS.length) % DUMMY_JOBS.length);
    const handleNext = () => setIndex((prev) => (prev + 1) % DUMMY_JOBS.length);

    const currentJob = DUMMY_JOBS[index];

    return (
        <div className="job-slider-wrap ann-parent">
            <div className="slider-header">
                <span className="slider-title">직업정보</span>
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
                        {currentJob.title}
                    </div>
                    <div className="card-top-split">
                        <div className="card-display-zone">
                            <img
                                src={currentJob.image}
                                alt={currentJob.title}
                                onError={handleImageError}
                            />
                        </div>
                        <div className="card-stats-zone">
                            {currentJob.stats.map((st, i) => (
                                <div className="stat-row" key={i}>
                                    <span className="stat-label">{st.label}</span>
                                    <span className="stat-value">{st.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="card-bottom-desc">{currentJob.desc}</p>
            </div>
        </div>
    );
};

export default JobSlider;