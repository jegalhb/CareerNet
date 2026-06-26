// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/careernet.css';

import { AuthProvider } from './context/Useauth.jsx';
import Gnb         from './components/Gnb';
import AllMenuPage from './pages/AllMenuPage.jsx';
import SignupPage  from './pages/SignupPage.jsx';

import Main         from './pages/Main';
import CareerDesign from './pages/CareerDesign';
import JobInfo      from './pages/JobInfo';
import JobDetail    from './pages/JobDetail';
import Mentoring    from './pages/Mentoring';
import MyPage       from './pages/MyPage.jsx';
import RecruitPage from './pages/RecruitPage.jsx';
import RecruitDetailPage from './pages/RecruitDetailPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import CommunityDetailPage from './pages/CommunityDetailPage.jsx';
import FindIdPage from './pages/FindIdPage.jsx';
import FindPasswordPage from './pages/FindPasswordPage.jsx';

function AppInner() {
    const [activeDropdown, setActiveDropdown] = useState(null);

    return (
        <div className="wrap">
            <h2 className="sr-only">커리어넷 메인 구조</h2>

            {/* 드롭다운 오버레이 — signup/login 전용 페이지에서는 GNB 자체가 없으므로 안전 */}
            {activeDropdown && (
                <div className="overlay active" onClick={() => setActiveDropdown(null)} />
            )}

            <Routes>
                {/* 회원가입 · 로그인은 GNB 없는 전용 레이아웃 */}
                <Route path="/signup" element={<SignupPage />} />

                {/* 나머지는 GNB 포함 */}
                <Route path="*" element={
                    <>
                        <Gnb
                            activeDropdown={activeDropdown}
                            setActiveDropdown={setActiveDropdown}
                        />
                        <Routes>
                            <Route path="/"           element={<Main />} />
                            <Route path="/design"     element={<CareerDesign />} />
                            <Route path="/jobs"       element={<JobInfo />} />
                            <Route path="/jobs/:jobId"element={<JobDetail />} />
                            <Route path="/mentoring"  element={<Mentoring />} />
                            <Route path="/recruit"    element={<RecruitPage />} />
                            <Route path="/recruit/:recruitmentId" element={<RecruitDetailPage />} />
                            <Route path="/community"  element={<CommunityPage />} />
                            <Route path="/community/:postId" element={<CommunityDetailPage />} />
                            <Route path="/mypage/*"   element={<MyPage />} />
                            <Route path="/all-menu"   element={<AllMenuPage />} />
                            <Route path="/find-id"    element={<FindIdPage />} />
                            <Route path="/find-password" element={<FindPasswordPage />} />
                        </Routes>
                    </>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppInner />
            </AuthProvider>
        </Router>
    );
}

export default App;
