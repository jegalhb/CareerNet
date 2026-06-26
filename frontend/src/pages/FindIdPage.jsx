import React, { useState } from 'react';
import { PageShell } from './RecruitPage.jsx';

const FindIdPage = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(`${name || '사용자'}님의 가입 이메일은 회원가입 시 입력한 이메일 주소입니다. 현재 데모 단계에서는 운영자 확인 절차로 안내합니다.`);
    };

    return (
        <PageShell title="아이디 찾기" description="현재 계정은 이메일을 아이디로 사용합니다.">
            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>이름</label>
                <input value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} placeholder="가입한 이름" />
                <button style={buttonStyle}>확인</button>
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

export default FindIdPage;
