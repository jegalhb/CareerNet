// src/pages/AllMenuPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AllMenuPage = () => {
    const navigate = useNavigate();

    const menuData = [
        { title: '채용정보', links: ['채용정보 상세검색', '직종별', '지역별', '테마별'] },
        { title: '취업지원', links: ['직업심리검사', '진로상담', '취업지원 프로그램'] },
        { title: '직업/진로', links: ['직업정보 검색', '학과정보', '진로설계 로드맵'] },
        { title: '고객센터', links: ['공지사항', '자주 묻는 질문', '문의하기'] }
    ];

    return (
        <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#fff' }}>
            {/* 상단 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '32px', color: '#111' }}>전체 서비스 메뉴</h1>
                <button
                    onClick={() => navigate(-1)}
                    style={{ padding: '10px 24px', borderRadius: '50px', border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}
                >
                    닫기 ✕
                </button>
            </div>

            {/* 메뉴 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                {menuData.map((section, idx) => (
                    <div key={idx}>
                        <h3 style={{
                            fontSize: '18px',
                            color: '#2563eb',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '2px solid #2563eb'
                        }}>
                            {section.title}
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {section.links.map((link, i) => (
                                <li key={i} style={{ marginBottom: '12px' }}>
                                    <a href="#" style={{
                                        textDecoration: 'none',
                                        color: '#4b5563',
                                        fontSize: '15px',
                                        transition: 'all 0.2s'
                                    }}
                                       onMouseOver={(e) => { e.target.style.color = '#2563eb'; e.target.style.fontWeight = 'bold'; }}
                                       onMouseOut={(e) => { e.target.style.color = '#4b5563'; e.target.style.fontWeight = 'normal'; }}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 하단 배너 영역 (워크넷 스타일의 특징적인 포인트) */}
            <div style={{ marginTop: '80px', padding: '40px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>원하시는 정보를 찾기 어려우신가요?</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>통합 검색창을 통해 더 빠르게 찾을 수 있습니다.</p>
                <input type="text" placeholder="검색어를 입력하세요" style={{ padding: '12px 20px', width: '300px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
        </div>
    );
};

export default AllMenuPage;