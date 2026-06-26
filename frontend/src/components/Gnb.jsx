// src/components/Gnb.jsx
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Useauth.jsx';

const Gnb = ({ activeDropdown, setActiveDropdown }) => {
    const { isLoggedIn, user, logout, loginWithCredentials } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();

    // 이메일·비밀번호 입력값 (드롭다운 로그인용)
    const emailRef    = useRef('');
    const passwordRef = useRef('');
    const errorRef    = useRef(null);

    // 드롭다운 외부 클릭 감지용 ref
    const loginWrapRef  = useRef(null);
    const mypageWrapRef = useRef(null);

    useEffect(() => {
        const handle = (e) => {
            if (loginWrapRef.current  && !loginWrapRef.current.contains(e.target))  {
                if (activeDropdown === 'login')  setActiveDropdown(null);
            }
            if (mypageWrapRef.current && !mypageWrapRef.current.contains(e.target)) {
                if (activeDropdown === 'mypage') setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [activeDropdown, setActiveDropdown]);

    /* 드롭다운 로그인 제출 */
    const handleDropdownLogin = async (e) => {
        e.preventDefault();
        const email    = emailRef.current.value.trim();
        const password = passwordRef.current.value;
        if (!email || !password) {
            if (errorRef.current) errorRef.current.textContent = '이메일과 비밀번호를 입력해주세요.';
            return;
        }
        const result = await loginWithCredentials(email, password);
        if (result.ok) {
            setActiveDropdown(null);
        } else {
            if (errorRef.current) errorRef.current.textContent = result.error;
        }
    };

    /* 회원가입 버튼 → /signup 이동 */
    const handleSignupClick = () => {
        setActiveDropdown(null);
        navigate('/signup');
    };

    /* 로그아웃 */
    const handleLogout = () => {
        logout();
        setActiveDropdown(null);
        navigate('/');
    };

    /* 아바타 이니셜 */
    const initials = user?.userNm ? user.userNm.slice(0, 1) : '?';

    /* 현재 경로에 맞는 nav 활성화 */
    const navItems = [
        { label: '진로설계', path: '/design' },
        { label: '직업정보', path: '/jobs' },
        { label: '멘토링',   path: '/mentoring' },
        { label: '채용공고', path: '/recruit' },
        { label: '커뮤니티',path: '/community' },
    ];

    return (
        <nav className="gnb">
            {/* ── 로고 ── */}
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <div className="logo-mark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                </div>
                <span className="logo-text">CareerNet</span>
            </Link>

            {/* ── 중앙 네비게이션 ── */}
            <div className="gnb-nav" style={{position:"sticky"}}>
                {navItems.map(({ label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={location.pathname.startsWith(path) ? 'active' : ''}
                        style={{ textDecoration: 'none' }}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* ── 우측 컨트롤 ── */}
            <div className="gnb-right">

                {/* 마이페이지 아이콘 (로그인 상태에서만) */}
                {isLoggedIn && (
                    <div style={{ position: 'relative' }} ref={mypageWrapRef}>
                        <div
                            className="icon-btn"
                            onClick={() => setActiveDropdown(activeDropdown === 'mypage' ? null : 'mypage')}
                            title="마이페이지"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>

                        {activeDropdown === 'mypage' && (
                            <div className="my-dropdown">
                                {/* 프로필 헤더 */}
                                <div className="my-profile">
                                    <div className="my-avatar">{initials}</div>
                                    <div>
                                        <div className="my-name">{user?.userNm || '사용자'}</div>
                                        <div className="my-email">{user?.email || ''}</div>
                                    </div>
                                </div>
                                {/* 메뉴 목록 */}
                                <div className="my-menu">
                                    <Link to="/mypage/profile" className="my-menu-item" style={{ textDecoration: 'none' }}
                                          onClick={() => setActiveDropdown(null)}>
                                        내 프로필
                                    </Link>
                                    <Link to="/mypage/roadmap" className="my-menu-item" style={{ textDecoration: 'none' }}
                                          onClick={() => setActiveDropdown(null)}>
                                        내 진로 로드맵 <span className="my-badge">진행중</span>
                                    </Link>
                                    <div className="my-divider" />
                                    <Link to="/mypage/bookmarks" className="my-menu-item" style={{ textDecoration: 'none' }}
                                          onClick={() => setActiveDropdown(null)}>
                                        즐겨찾는 직업/학과
                                    </Link>
                                    <Link to="/mypage/tests" className="my-menu-item" style={{ textDecoration: 'none' }}
                                          onClick={() => setActiveDropdown(null)}>
                                        검사 결과 보기
                                    </Link>
                                    <Link to="/mypage/mentoring" className="my-menu-item" style={{ textDecoration: 'none' }}
                                          onClick={() => setActiveDropdown(null)}>
                                        멘토링 내역
                                    </Link>
                                </div>
                                <div className="my-logout" onClick={handleLogout}>
                                    로그아웃
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 로그인 버튼 */}
                <div style={{ position: 'relative' }} ref={loginWrapRef}>
                    <button
                        className="btn-login"
                        onClick={() => setActiveDropdown(activeDropdown === 'login' ? null : 'login')}
                    >
                        {isLoggedIn ? '내 정보' : '로그인'}
                    </button>

                    {activeDropdown === 'login' && (
                        <div className="login-dropdown">
                            <div className="ld-header">
                                <p>커리어넷에 오신 것을 환영합니다</p>
                                <strong>로그인 또는 회원가입</strong>
                            </div>
                            <form className="ld-body" onSubmit={handleDropdownLogin}>
                                <input
                                    className="ld-input"
                                    type="email"
                                    placeholder="이메일"
                                    ref={emailRef}
                                    autoComplete="email"
                                />
                                <input
                                    className="ld-input"
                                    type="password"
                                    placeholder="비밀번호"
                                    ref={passwordRef}
                                    autoComplete="current-password"
                                />
                                {/* 오류 메시지 영역 */}
                                <p ref={errorRef} className="ld-error" />
                                <button type="submit" className="ld-btn-main">
                                    로그인
                                </button>
                                <div className="ld-divider"><span>또는</span></div>
                                {/* 회원가입하기 → /signup 이동 */}
                                <button
                                    type="button"
                                    className="ld-btn-signup"
                                    onClick={handleSignupClick}
                                >
                                    회원가입하기
                                </button>
                            </form>
                            <div className="ld-footer">
                                <Link to="/find-id"       onClick={() => setActiveDropdown(null)}>아이디 찾기</Link>
                                <Link to="/find-password" onClick={() => setActiveDropdown(null)}>비밀번호 찾기</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 전체 메뉴 햄버거 */}
                <Link to="/all-menu" className="hamburger-btn" title="전체 서비스 목록"
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </Link>
            </div>
        </nav>
    );
};


export default Gnb;
