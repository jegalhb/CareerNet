import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindPasswordPage = () => {
    const [form, setForm] = useState({ email: '', name: '' });
    const [message, setMessage] = useState('');

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setMessage('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setMessage('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        setMessage(`${form.email} 주소로 비밀번호 재설정 안내를 보내는 기능을 연결할 예정입니다. 현재는 계정 확인 안내 화면입니다.`);
    };

    return (
        <main style={{ minHeight: 'calc(100vh - 56px)', background: '#f8fafc', padding: '42px 24px 64px' }}>
            <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '22px', alignItems: 'stretch' }}>
                <section style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundImage: 'linear-gradient(rgba(26,54,93,0.74), rgba(26,54,93,0.9)), url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=900&auto=format&fit=crop)',
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
                            안전하게 계정을 확인하고<br />비밀번호를 재설정하세요
                        </h1>
                        <p style={{ color: '#dbeafe', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                            이메일 확인 이후 비밀번호 재설정 기능과 연결할 수 있도록 구성한 화면입니다.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {['이메일 확인', '본인 확인', '재설정 안내'].map((label, index) => (
                            <div key={label} style={{ background: index === 0 ? '#fff' : 'rgba(255,255,255,0.14)', color: index === 0 ? '#1a365d' : '#fff', borderRadius: '8px', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 900 }}>
                                {index + 1}. {label}
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '34px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ color: '#2563eb', fontSize: '12px', fontWeight: 900, margin: '0 0 8px' }}>PASSWORD RESET</p>
                        <h2 style={{ color: '#111827', fontSize: '26px', fontWeight: 900, margin: '0 0 8px' }}>비밀번호 찾기</h2>
                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                            가입 이메일을 입력하면 비밀번호 재설정 절차를 안내합니다.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <FieldLabel label="이메일" desc="회원가입 시 사용한 이메일 주소를 입력해주세요." />
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => handleChange('email', event.target.value)}
                            style={inputStyle}
                            placeholder="example@email.com"
                        />

                        <FieldLabel label="이름" desc="추가 본인 확인에 사용할 이름입니다." />
                        <input
                            value={form.name}
                            onChange={(event) => handleChange('name', event.target.value)}
                            style={inputStyle}
                            placeholder="홍길동"
                        />

                        <button type="submit" style={primaryButtonStyle}>재설정 안내 확인</button>
                        {message && <div style={noticeStyle}>{message}</div>}

                        <div style={linkRowStyle}>
                            <Link to="/find-id" style={textLinkStyle}>아이디 찾기</Link>
                            <Link to="/signup" style={textLinkStyle}>회원가입</Link>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
};

const FieldLabel = ({ label, desc }) => (
    <label style={{ display: 'block', marginBottom: '8px' }}>
        <span style={{ display: 'block', color: '#111827', fontSize: '13px', fontWeight: 900, marginBottom: '3px' }}>{label}</span>
        <span style={{ display: 'block', color: '#6b7280', fontSize: '11px' }}>{desc}</span>
    </label>
);

const inputStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 13px', fontSize: '14px', marginBottom: '4px' };
const primaryButtonStyle = { border: 'none', borderRadius: '8px', background: '#1a365d', color: '#fff', padding: '13px 16px', fontWeight: 900, cursor: 'pointer', marginTop: '4px' };
const noticeStyle = { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: '8px', padding: '13px', fontSize: '13px', lineHeight: 1.6 };
const linkRowStyle = { display: 'flex', justifyContent: 'center', gap: '16px', paddingTop: '8px' };
const textLinkStyle = { color: '#2563eb', fontSize: '13px', fontWeight: 800, textDecoration: 'none' };

export default FindPasswordPage;
