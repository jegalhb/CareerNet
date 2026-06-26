import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoadmapCard from '../components/RoadmapCard';
import JobSlider from '../components/JobSlider';
import DeptSlider from '../components/DeptSlider.jsx';
import { getCommunityPosts, getRecruitments } from '../api/careernetApi';
import { useAuth } from '../context/Useauth.jsx';

const QUICK_ITEMS = [
    { label: '진로 검사', route: '/design', icon: 'document' },
    { label: '직업 정보', route: '/jobs', icon: 'search' },
    { label: '멘토링', route: '/mentoring', icon: 'people' },
    { label: '채용공고', route: '/recruit', icon: 'briefcase' },
    { label: '커뮤니티', route: '/community', icon: 'board' },
];

const POPULAR_SERVICES = [
    {
        title: 'Holland 진로 검사',
        desc: '흥미 유형을 분석해 나와 맞는 직업 후보를 추천합니다.',
        route: '/design',
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=700&auto=format&fit=crop',
    },
    {
        title: '현직자 멘토링',
        desc: '추천 직업과 연결된 실무자의 경험을 확인하고 상담을 신청합니다.',
        route: '/mentoring',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=700&auto=format&fit=crop',
    },
    {
        title: '관심 직업 저장',
        desc: '탐색한 직업을 저장하고 마이페이지에서 다시 확인합니다.',
        route: '/mypage/bookmarks',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=700&auto=format&fit=crop',
    },
];

const Main = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const [activeTab, setActiveTab] = useState('recommended');
    const [keyword, setKeyword] = useState('');
    const [latestPosts, setLatestPosts] = useState([]);
    const [latestRecruitments, setLatestRecruitments] = useState([]);

    useEffect(() => {
        const loadHomeData = async () => {
            const [postsResult, recruitmentsResult] = await Promise.allSettled([
                getCommunityPosts({ latest: true }),
                getRecruitments({ latest: true }),
            ]);

            if (postsResult.status === 'fulfilled') {
                setLatestPosts(postsResult.value);
            }
            if (recruitmentsResult.status === 'fulfilled') {
                setLatestRecruitments(recruitmentsResult.value);
            }
        };
        loadHomeData();
    }, []);

    const tabContent = useMemo(() => {
        if (activeTab === 'popular') {
            return <PopularServices />;
        }
        if (activeTab === 'news') {
            return <NewsList posts={latestPosts} recruitments={latestRecruitments} />;
        }
        return <RecommendedServices />;
    }, [activeTab, latestPosts, latestRecruitments]);

    const handleSearch = (event) => {
        event.preventDefault();
        const query = keyword.trim();
        navigate(query ? `/jobs?keyword=${encodeURIComponent(query)}` : '/jobs');
    };

    return (
        <>
            <section className="hero">
                <div className="hero-tag">진로 탐색부터 현직자 멘토링까지</div>
                <h1>나에게 맞는 진로를 찾고<br />실제 준비 흐름까지 이어가세요</h1>
                <p>직업 정보, Holland 진로 분석, 채용공고, 실무자 멘토링을 한 곳에서 확인합니다.</p>
                <form className="search-wrap" onSubmit={handleSearch}>
                    <div className="search-box">
                        <select className="search-select" aria-label="검색 분류">
                            <option>전체</option>
                            <option>직업</option>
                            <option>학과</option>
                            <option>멘토</option>
                        </select>
                        <input
                            className="search-input"
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="직업명, 분야, 관심 키워드로 검색"
                        />
                        <button className="search-btn">검색</button>
                    </div>
                    <div className="search-tags">
                        {['프론트엔드 개발자', '데이터 분석가', 'UX/UI 디자이너'].map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                className="search-tag"
                                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </form>
            </section>

            <section className="quick">
                <div className="quick-grid">
                    {QUICK_ITEMS.map((item) => (
                        <Link className="quick-item" key={item.label} to={item.route}>
                            <div className="quick-icon"><QuickIcon type={item.icon} /></div>
                            <span className="quick-label">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section style={homeTabsWrapStyle}>
                <div style={homeTabsStyle}>
                    {[
                        ['recommended', '추천 서비스', '검사, 멘토링, 채용 탐색'],
                        ['popular', '인기 서비스', '많이 이용하는 기능'],
                        ['news', '새소식', '공지와 최신 채용'],
                    ].map(([id, label, desc]) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                style={{
                                    ...homeTabButtonStyle,
                                    background: active ? '#1a365d' : '#fff',
                                    color: active ? '#fff' : '#334155',
                                    borderColor: active ? '#1a365d' : '#e5e7eb',
                                    boxShadow: active ? '0 10px 22px rgba(26,54,93,0.18)' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '14px', fontWeight: 900 }}>{label}</span>
                                <span style={{ fontSize: '11px', color: active ? '#dbeafe' : '#64748b', marginTop: '3px' }}>
                                    {desc}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {tabContent}

            <div className="three-col-grid" style={{ padding: '2rem 2rem 1.5rem' }}>
                <LoginGuideCard isLoggedIn={isLoggedIn} user={user} />
                <JobSlider />
                <DeptSlider />
            </div>

            <div className="main-grid" style={{ paddingTop: '0' }}>
                <RoadmapCard />
            </div>

            <section className="banner">
                <div className="banner-text">
                    <strong>진로 분석 서비스</strong> 검사 결과와 직업 정보를 연결해 다음 행동을 추천합니다.
                </div>
                <Link to="/design" className="banner-btn" style={{ textDecoration: 'none' }}>시작하기</Link>
            </section>
        </>
    );
};

const RecommendedServices = () => (
    <section style={panelStyle}>
        {POPULAR_SERVICES.slice(0, 2).map((service) => (
            <ServiceCard key={service.title} service={service} />
        ))}
        <ServiceCard service={{
            title: '채용공고 탐색',
            desc: '관심 직업이 실제 채용 시장에서 어떤 역량을 요구하는지 확인합니다.',
            route: '/recruit',
            image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=700&auto=format&fit=crop',
        }} />
    </section>
);

const PopularServices = () => (
    <section style={panelStyle}>
        {POPULAR_SERVICES.map((service) => <ServiceCard key={service.title} service={service} />)}
    </section>
);

const NewsList = ({ posts, recruitments }) => (
    <section style={{ ...panelStyle, gridTemplateColumns: '1fr 1fr' }}>
        <div style={listPanelStyle}>
            <div style={listHeaderStyle}>
                <h3 style={listTitleStyle}>새소식 게시판</h3>
                <Link to="/community" style={moreLinkStyle}>전체 보기</Link>
            </div>
            {(posts.length ? posts : []).slice(0, 5).map((post) => (
                <Link key={post.postId} to={`/community/${post.postId}`} style={rowLinkStyle}>
                    <span style={{ color: '#1a365d', fontWeight: 800 }}>{post.category}</span>
                    <strong>{post.title}</strong>
                </Link>
            ))}
            {!posts.length && <p style={emptyTextStyle}>표시할 새소식이 없습니다.</p>}
        </div>
        <div style={listPanelStyle}>
            <div style={listHeaderStyle}>
                <h3 style={listTitleStyle}>최신 채용공고</h3>
                <Link to="/recruit" style={moreLinkStyle}>전체 보기</Link>
            </div>
            {(recruitments.length ? recruitments : []).slice(0, 4).map((item) => (
                <Link key={item.recruitmentId} to={`/recruit/${item.recruitmentId}`} style={rowLinkStyle}>
                    <span style={{ color: '#1a365d', fontWeight: 800 }}>{item.companyName}</span>
                    <strong>{item.title}</strong>
                </Link>
            ))}
            {!recruitments.length && <p style={emptyTextStyle}>표시할 채용공고가 없습니다.</p>}
        </div>
    </section>
);

const ServiceCard = ({ service }) => (
    <Link to={service.route} style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        color: 'inherit',
        overflow: 'hidden',
        textDecoration: 'none',
    }}>
        <img src={service.image} alt={`${service.title} 이미지`} style={{ width: '100%', height: '138px', objectFit: 'cover' }} />
        <div style={{ padding: '16px' }}>
            <h3 style={{ color: '#111827', fontSize: '16px', margin: '0 0 7px', fontWeight: 800 }}>{service.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{service.desc}</p>
        </div>
    </Link>
);

const LoginGuideCard = ({ isLoggedIn, user }) => (
    <div className="job-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
        <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=700&auto=format&fit=crop"
            alt="진로 상담 회의 이미지"
            style={{ width: '100%', height: '112px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }}
        />
        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', lineHeight: 1.55, margin: 0 }}>
            {isLoggedIn
                ? `${user?.userNm || '회원'}님의 검사 결과, 관심 직업, 멘토링 신청 내역을 마이페이지에서 이어서 관리할 수 있습니다.`
                : '로그인하면 검사 결과, 관심 직업, 멘토링 신청 내역을 마이페이지에서 이어서 관리할 수 있습니다.'}
        </p>
        <Link to={isLoggedIn ? '/mypage/roadmap' : '/design'} className="ld-btn-main" style={{ marginTop: '16px', borderRadius: '20px', padding: '10px 24px', width: 'auto', textAlign: 'center', textDecoration: 'none' }}>
            {isLoggedIn ? '내 진로 로드맵 보기' : '진로 검사 시작'}
        </Link>
    </div>
);

const QuickIcon = ({ type }) => {
    const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: '#1a365d', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (type === 'search') return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
    if (type === 'people') return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    if (type === 'briefcase') return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
    if (type === 'board') return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></svg>;
    return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8" /></svg>;
};

const panelStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    background: '#f9fafb',
    padding: '1.5rem 2rem 0',
};

const listPanelStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px' };
const listHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const listTitleStyle = { color: '#111827', fontSize: '16px', margin: 0, fontWeight: 800 };
const moreLinkStyle = { color: '#2563eb', fontSize: '12px', fontWeight: 800, textDecoration: 'none' };
const rowLinkStyle = { display: 'grid', gridTemplateColumns: '86px 1fr', gap: '10px', padding: '10px 0', borderTop: '1px solid #f3f4f6', color: '#374151', fontSize: '13px', textDecoration: 'none' };
const emptyTextStyle = { color: '#6b7280', fontSize: '13px', margin: '14px 0 0' };

const homeTabsWrapStyle = {
    background: '#f9fafb',
    padding: '22px 2rem 0',
};

const homeTabsStyle = {
    maxWidth: '980px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '12px',
};

const homeTabButtonStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
};

export default Main;
