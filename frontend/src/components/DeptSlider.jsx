import React, { useEffect, useRef, useState } from 'react';

const DEPARTMENTS = [
    {
        title: '컴퓨터공학과',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=700&auto=format&fit=crop',
        desc: '소프트웨어, 데이터베이스, 네트워크, 인공지능 등 IT 서비스의 기반 기술을 배웁니다.',
        stats: [
            ['연결 직업', '개발자'],
            ['학습 난이도', '높음'],
            ['취업 전망', '매우 좋음'],
        ],
    },
    {
        title: '데이터사이언스학과',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=700&auto=format&fit=crop',
        desc: '통계, 프로그래밍, 머신러닝을 활용해 데이터에서 의사결정에 필요한 근거를 찾습니다.',
        stats: [
            ['연결 직업', '데이터 분석가'],
            ['학습 난이도', '높음'],
            ['취업 전망', '좋음'],
        ],
    },
    {
        title: '시각디자인학과',
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=700&auto=format&fit=crop',
        desc: '브랜드, 편집, 서비스 화면 등 정보를 시각적으로 전달하는 디자인 역량을 기릅니다.',
        stats: [
            ['연결 직업', 'UX/UI 디자이너'],
            ['포트폴리오', '중요'],
            ['협업 역량', '중요'],
        ],
    },
    {
        title: '상담심리학과',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=700&auto=format&fit=crop',
        desc: '사람의 마음과 행동을 이해하고 상담, 교육, 복지 현장에서 돕는 방법을 배웁니다.',
        stats: [
            ['연결 직업', '진로상담사'],
            ['자격 준비', '필요'],
            ['사회 기여', '높음'],
        ],
    },
    {
        title: '신재생에너지공학과',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=700&auto=format&fit=crop',
        desc: '태양광, 풍력, 에너지 저장 등 친환경 에너지 시스템을 설계하고 분석합니다.',
        stats: [
            ['연결 직업', '에너지 엔지니어'],
            ['산업 수요', '증가'],
            ['환경 가치', '높음'],
        ],
    },
];

const DeptSlider = () => {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setIndex((prev) => (prev + 1) % DEPARTMENTS.length);
            }, 4000);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying]);

    const handlePrev = () => setIndex((prev) => (prev - 1 + DEPARTMENTS.length) % DEPARTMENTS.length);
    const handleNext = () => setIndex((prev) => (prev + 1) % DEPARTMENTS.length);
    const currentDept = DEPARTMENTS[index];

    return (
        <div className="dept-slider-wrap ann-parent">
            <div className="slider-header">
                <span className="slider-title">학과정보</span>
                <div className="slider-controls">
                    <button className="slider-ctrl-btn" onClick={handlePrev}>‹</button>
                    <button className="slider-ctrl-btn" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? '일시정지' : '재생'}
                    </button>
                    <button className="slider-ctrl-btn" onClick={handleNext}>›</button>
                </div>
            </div>

            <div className="info-slider-card">
                <div>
                    <div className="card-job-title" style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>
                        {currentDept.title}
                    </div>
                    <div className="card-top-split">
                        <div className="card-display-zone">
                            <img src={currentDept.image} alt={`${currentDept.title} 관련 이미지`} />
                        </div>
                        <div className="card-stats-zone">
                            {currentDept.stats.map(([label, value]) => (
                                <div className="stat-row" key={label}>
                                    <span className="stat-label">{label}</span>
                                    <span className="stat-value" style={{ color: '#e11d48' }}>{value}</span>
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
