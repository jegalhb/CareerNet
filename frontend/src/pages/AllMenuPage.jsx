// src/pages/AllMenuPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Useauth.jsx';

const menuData = [
    {
        title: '진로 탐색',
        desc: '검사부터 추천 직업까지.',
        links: [
            { label: '진로 검사 시작', path: '/design', desc: 'Holland 검사를 진행하고 추천 직업을 확인합니다.' },
            { label: '직업정보 검색', path: '/jobs', desc: '직업 100종의 설명, 역량, 전망을 탐색합니다.' },
            { label: '내 진로 로드맵', path: '/mypage/roadmap', desc: '진단부터 취업 준비까지 단계별 준비 상황을 확인합니다.', requiresAuth: true },
        ],
    },
    {
        title: '멘토링',
        desc: '추천 직업과 실제 실무자를 연결합니다.',
        links: [
            { label: '현직자 멘토링', path: '/mentoring', desc: '직업별 멘토를 확인하고 멘토링을 신청합니다.' },
            { label: '멘토링 신청 내역', path: '/mypage/mentoring', desc: '내가 신청한 멘토링 상태와 메시지를 확인합니다.', requiresAuth: true },
            { label: '검사 결과 보기', path: '/mypage/tests', desc: '저장된 검사 결과와 추천 직업을 다시 확인합니다.', requiresAuth: true },
        ],
    },
    {
        title: '취업 정보',
        desc: '직업 탐색을 실제 채용 시장 정보와 연결합니다.',
        links: [
            { label: '채용공고', path: '/recruit', desc: '직업과 연결된 채용공고 목록을 확인합니다.' },
            { label: '관심 직업', path: '/mypage/bookmarks', desc: '저장한 관심 직업을 모아서 확인합니다.', requiresAuth: true },
            { label: '마이페이지', path: '/mypage/profile', desc: '프로필, 로드맵, 검사 결과, 멘토링을 관리합니다.', requiresAuth: true },
        ],
    },
    {
        title: '커뮤니티',
        desc: '공지, 질문, 후기, 새소식을 확인합니다.',
        links: [
            { label: '커뮤니티 전체', path: '/community', desc: '커뮤니티 게시글 목록을 확인합니다.' },
            { label: '아이디 찾기', path: '/find-id', desc: '이메일 아이디 확인 흐름으로 이동합니다.' },
            { label: '비밀번호 찾기', path: '/find-password', desc: '비밀번호 재설정 안내 화면으로 이동합니다.' },
        ],
    },
];

const AllMenuPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [keyword, setKeyword] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmed = keyword.trim();
        navigate(trimmed ? `/jobs?keyword=${encodeURIComponent(trimmed)}` : '/jobs');
    };

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '42px 32px 64px' }}>
            <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '30px',
                }}>
                    <div>
                        <h1 style={{ fontSize: '30px', color: '#111827', margin: '0 0 8px', fontWeight: 800 }}>
                            전체 서비스 메뉴
                        </h1>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                            CareerNet의 주요 기능으로 바로 이동할 수 있습니다.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '999px',
                            border: '1px solid #d1d5db',
                            background: '#fff',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 800,
                        }}
                    >
                        닫기
                    </button>
                </header>

                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                }}>
                    {menuData.map((section) => (
                        <div
                            key={section.title}
                            style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '20px',
                            }}
                        >
                            <h2 style={{ fontSize: '18px', color: '#1a365d', margin: '0 0 6px', fontWeight: 800 }}>
                                {section.title}
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: 1.55, margin: '0 0 16px' }}>
                                {section.desc}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {section.links.map((link) => (
                                    <ServiceMenuLink
                                        key={link.label}
                                        link={link}
                                        isLoggedIn={isLoggedIn}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <form
                    onSubmit={handleSearch}
                    style={{
                        marginTop: '28px',
                        padding: '24px',
                        background: '#1a365d',
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#fff', fontSize: '18px', margin: '0 0 6px', fontWeight: 800 }}>
                            원하는 직업을 바로 검색하세요
                        </h2>
                        <p style={{ color: '#dbeafe', fontSize: '12px', margin: 0 }}>
                            예: 백엔드 개발자, 데이터 분석가, UX/UI 디자이너
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            type="text"
                            placeholder="검색어를 입력하세요"
                            style={{
                                width: '280px',
                                border: '1px solid rgba(255,255,255,0.35)',
                                borderRadius: '8px',
                                padding: '11px 12px',
                                fontSize: '14px',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                border: 'none',
                                borderRadius: '8px',
                                background: '#fff',
                                color: '#1a365d',
                                padding: '11px 16px',
                                fontSize: '14px',
                                fontWeight: 800,
                                cursor: 'pointer',
                            }}
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const ServiceMenuLink = ({ link, isLoggedIn }) => {
    const locked = link.requiresAuth && !isLoggedIn;
    const target = locked ? '/signup' : link.path;

    return (
        <Link
            to={target}
            style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                border: locked ? '1px solid #fde68a' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '13px',
                background: locked ? '#fffbeb' : '#f9fafb',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '5px',
            }}>
                <strong style={{ color: '#111827', fontSize: '14px' }}>{link.label}</strong>
                {locked ? (
                    <span style={{
                        color: '#92400e',
                        background: '#fef3c7',
                        borderRadius: '999px',
                        padding: '3px 7px',
                        fontSize: '10px',
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                    }}>
                        로그인 필요
                    </span>
                ) : (
                    <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: 800 }}>›</span>
                )}
            </div>
            <p style={{ color: locked ? '#92400e' : '#6b7280', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                {locked ? '로그인 후 이용할 수 있습니다. 회원가입 또는 로그인 화면으로 이동합니다.' : link.desc}
            </p>
        </Link>
    );
};

export default AllMenuPage;
