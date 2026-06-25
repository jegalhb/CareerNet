// src/pages/Main.jsx
import React from 'react';
import RoadmapCard from '../components/RoadmapCard';
import JobSlider from '../components/JobSlider';
import DeptSlider from '../components/DeptSlider.jsx'; // components 내부 경로 보정 대응

const Main = () => {
    // 깨지지 않는 고화질 인라인 SVG 퀵 메뉴 아이템 세팅
    const QUICK_ITEMS = [
        { label: '진로 흥미검사', route: '/design', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>) },
        { label: 'AI 진로분석', route: '/design', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>) },
        { label: '1:1 멘토링', route: '/mentoring', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>) },
        { label: '채용 공고', route: '/', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>) },
        { label: '학과 탐색', route: '/jobs', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>) }
    ];

    return (
        <>
            {/* [위치 복원 1] Hero Section이 가장 먼저 배치됩니다 */}
            <div className="hero">
                <div className="hero-tag">AI 기반 진로 탐색 플랫폼</div>
                <h1>나만의 진로 로드맵을<br />지금 시작하세요</h1>
                <p>직업정보 · AI 진로분석 · 1:1 멘토링을 한 곳에서</p>
                <div className="search-wrap">
                    <div className="search-box">
                        <select className="search-select">
                            <option>전체</option><option>직업</option><option>학과</option><option>자격증</option>
                        </select>
                        <input className="search-input" type="text" placeholder="직업명, 학과, 관심 분야를 검색하세요" />
                        <button className="search-btn"><i className="ti ti-search"></i> 검색</button>
                    </div>
                    <div className="search-tags">
                        <span className="search-tag"># UI/UX 디자이너</span>
                        <span className="search-tag"># 데이터 사이언티스트</span>
                        <span className="search-tag"># AI 엔지니어</span>
                    </div>
                </div>
            </div>

            {/* [위치 복원 2] 퀵 메뉴 아이콘 영역이 배너 아래로 정상 안착합니다 */}
            <div className="quick">
                <div className="quick-grid">
                    {QUICK_ITEMS.map((item, index) => (
                        <div className="quick-item" key={index} onClick={() => window.location.href = item.route}>
                            <div className="quick-icon">{item.icon}</div>
                            <span className="quick-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* [위치 복원 3] 서비스 전환 탭 메뉴 */}
            <div className="tab-nav">
                <div className="tab active">추천 서비스</div>
                <div className="tab">인기 서비스</div>
                <div className="tab">새소식</div>
            </div>

            {/* [위치 복원 4] 로그인 권장 안내 및 슬라이더 카드 라인 */}
            <div className="three-col-grid" style={{ padding: '2rem 2rem 1.5rem' }}>
                <div className="job-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
                    <div style={{ fontSize: '42px', marginBottom: '12px' }}>👥</div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gray-600)', textAlign: 'center', lineHeight: '1.4' }}>
                        나에게 꼭 맞는 <strong>진로 정보</strong>를 받고 싶으신가요?<br />
                        로그인하시면 관심사에 맞춘 <span style={{ color: 'var(--blue-600)', fontWeight: '700' }}>진로 정보를 추천</span>해 드려요.
                    </p>
                    <button className="ld-btn-main" style={{ marginTop: '16px', borderRadius: '20px', padding: '10px 24px', width: 'auto' }}>
                        로그인 하기 &gt;
                    </button>
                </div>
                <JobSlider />
                <DeptSlider />
            </div>

            {/* [위치 복원 5] 내 진로 로드맵 스테퍼 영역 */}
            <div className="main-grid" style={{ paddingTop: '0' }}>
                <RoadmapCard />
            </div>

            {/* 하단 배너 고정 */}
            <div className="banner">
                <div className="banner-text"><strong>AI 진로분석 서비스</strong> — 나의 강점과 적성에 맞는 직업을 AI가 추천해드립니다</div>
                <button className="banner-btn">무료로 시작하기</button>
            </div>
        </>
    );
};

export default Main;