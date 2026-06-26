import React, { useState } from 'react';
import { PageShell } from './RecruitPage.jsx';

const FindPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(`${email || '입력한 이메일'}로 비밀번호 재설정 안내를 보내는 흐름을 연결할 예정입니다. 현재는 데모 안내 화면입니다.`);
    };

    return (
        <PageShell title="비밀번호 찾기" description="비밀번호 재설정 안내를 받을 이메일을 입력합니다.">
            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>이메일</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} placeholder="example@email.com" />
                <button style={buttonStyle}>재설정 안내 확인</button>
                {message && <p style={messageStyle}>{message}</p>}
            </form>
        </PageShell>
    );
};

const formStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '22px', maxWidth: '460px' };
const labelStyle = { display: 'block', color: '#374151', fontSize: '13px', fontWeight: 800, marginBottom: '8px' };
const inputStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '11px 12px', marginBottom: '12px' };
const buttonStyle = { border: 'none', borderRadius: '8px', background: '#1a365d', color: '#fff', padding: '10px 16px', fontWeight: 800 };
const messageStyle = { marginTop: '14px', color: '#1a365d', fontSize: '13px', lineHeight: 1.6 };

export default FindPasswordPage;
