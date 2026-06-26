import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindIdPage = () => {
    const [form, setForm] = useState({ name: '', phone: '' });
    const [message, setMessage] = useState('');

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setMessage('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.name.trim()) {
            setMessage('이름을 입력해주세요.');
            return;
        }
        setMessage('CareerNet은 이메일을 아이디로 사용합니다. 가입 시 사용한 이메일 주소를 확인하거나 운영자 확인 절차를 진행해주세요.');
    };

    return (
        <RecoveryLayout
            title="아이디 찾기"
            subtitle="가입 정보를 확인해 이메일 아이디를 찾는 화면입니다."
            activeStep="identity"
        >
            <form onSubmit={handleSubmit} style={formStyle}>
                <FieldLabel label="이름" desc="회원가입 시 입력한 이름을 입력해주세요." />
                <input
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    style={inputStyle}
                    placeholder="홍길동"
                />

                <FieldLabel label="연락처" desc="추후 문자 인증 기능과 연결될 수 있는 항목입니다." />
                <input
                    value={form.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    style={inputStyle}
                    placeholder="010-0000-0000"
                />

                <button type="submit" style={primaryButtonStyle}>아이디 확인하기</button>
                {message && <div style={noticeStyle}>{message}</div>}

                <div style={linkRowStyle}>
                    <Link to="/find-password" style={textLinkStyle}>비밀번호 찾기</Link>
                    <Link to="/signup" style={textLinkStyle}>회원가입</Link>
                </div>
            </form>
        </RecoveryLayout>
    );
};

const RecoveryLayout = ({ title, subtitle, activeStep, children }) => (
    <main style={{ minHeight: 'calc(100vh - 56px)', background: '#f8fafc', padding: '42px 24px 64px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '22px', alignItems: 'stretch' }}>
            <section style={{
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundImage: 'linear-gradient(rgba(26,54,93,0.76), rgba(26,54,93,0.88)), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '34px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '520px',
            }}>
                <div>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 900 }}>CareerNet</Link>
                    <h1 style={{ fontSize: '30px', lineHeight: 1.28, margin: '42px 0 12px', fontWeight: 900 }}>
                        계정 정보를 다시 확인하고<br />진로 탐색을 이어가세요
                    </h1>
                    <p style={{ color: '#dbeafe', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                        검사 결과, 관심 직업, 멘토링 내역은 계정과 연결되어 저장됩니다.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                        ['identity', '본인 정보 확인'],
                        ['account', '계정 안내'],
                        ['continue', '서비스 이어가기'],
                    ].map(([id, label], index) => (
                        <div key={id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '11px 12px',
                            borderRadius: '8px',
                            background: activeStep === id ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.18)',
                        }}>
                            <span style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: activeStep === id ? '#fff' : 'rgba(255,255,255,0.16)',
                                color: activeStep === id ? '#1a365d' : '#fff',
                                fontSize: '12px',
                                fontWeight: 900,
                            }}>
                                {index + 1}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 800 }}>{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '34px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ color: '#2563eb', fontSize: '12px', fontWeight: 900, margin: '0 0 8px' }}>ACCOUNT RECOVERY</p>
                    <h2 style={{ color: '#111827', fontSize: '26px', fontWeight: 900, margin: '0 0 8px' }}>{title}</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
                </div>
                {children}
            </section>
        </div>
    </main>
);

const FieldLabel = ({ label, desc }) => (
    <label style={{ display: 'block', marginBottom: '8px' }}>
        <span style={{ display: 'block', color: '#111827', fontSize: '13px', fontWeight: 900, marginBottom: '3px' }}>{label}</span>
        <span style={{ display: 'block', color: '#6b7280', fontSize: '11px' }}>{desc}</span>
    </label>
);

const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 13px', fontSize: '14px', marginBottom: '4px' };
const primaryButtonStyle = { border: 'none', borderRadius: '8px', background: '#1a365d', color: '#fff', padding: '13px 16px', fontWeight: 900, cursor: 'pointer', marginTop: '4px' };
const noticeStyle = { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: '8px', padding: '13px', fontSize: '13px', lineHeight: 1.6 };
const linkRowStyle = { display: 'flex', justifyContent: 'center', gap: '16px', paddingTop: '8px' };
const textLinkStyle = { color: '#2563eb', fontSize: '13px', fontWeight: 800, textDecoration: 'none' };

export default FindIdPage;
