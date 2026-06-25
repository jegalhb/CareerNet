import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
    const [view, setView] = useState('login'); // 'login' 또는 'signup'
    const [formData, setFormData] = useState({
        id: '', password: '', email: '',
        education: '', interest: '' // 진로 탐색을 위한 확장 필드
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제출된 데이터:", formData);
        alert(view === 'login' ? "로그인 성공!" : "회원가입 완료! 진로 데이터를 분석합니다.");
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: '#fff', padding: '40px', borderRadius: '16px',
                width: '100%', maxWidth: '450px', position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }} onClick={(e) => e.stopPropagation()}>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#111827' }}>
                    {view === 'login' ? '로그인' : '회원가입'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="아이디" required onChange={(e) => setFormData({...formData, id: e.target.value})} style={inputStyle} />
                    <input type="password" placeholder="비밀번호" required onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />

                    {view === 'signup' && (
                        <>
                            <input type="email" placeholder="이메일" required onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                            {/* 진로 탐색용 확장 필드 */}
                            <select onChange={(e) => setFormData({...formData, education: e.target.value})} style={inputStyle}>
                                <option value="">최종 학력 선택</option>
                                <option value="highschool">고등학교 재학/졸업</option>
                                <option value="university">대학교 재학/졸업</option>
                            </select>
                            <select onChange={(e) => setFormData({...formData, interest: e.target.value})} style={inputStyle}>
                                <option value="">관심 분야 선택</option>
                                <option value="it">IT/개발</option>
                                <option value="design">디자인</option>
                                <option value="data">데이터 분석</option>
                                <option value="etc">기타</option>
                            </select>
                        </>
                    )}

                    <button type="submit" style={{
                        marginTop: '10px', padding: '14px', background: '#2563eb',
                        color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        {view === 'login' ? '로그인하기' : '가입 완료하기'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                    {view === 'login' ? '아직 회원이 아니신가요?' : '이미 회원이신가요?'}
                    <span onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                          style={{ color: '#2563eb', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}>
                        {view === 'login' ? '회원가입' : '로그인'}
                    </span>
                </p>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
        </div>
    );
};

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' };

export default AuthModal;