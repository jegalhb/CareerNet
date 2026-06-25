// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/Useauth.jsx';

/* ── 상수 ───────────────────────────────────────────────────── */
const STEPS = ['기본 정보', '진로 정보', '가입 완료'];

const EDUCATION_OPTIONS = [
    { value: '',           label: '최종 학력 선택' },
    { value: 'middle',     label: '중학교 재학/졸업' },
    { value: 'highschool', label: '고등학교 재학/졸업' },
    { value: 'university', label: '대학교(4년제) 재학/졸업' },
    { value: 'college',    label: '전문대학 재학/졸업' },
    { value: 'graduate',   label: '대학원 이상' },
    { value: 'etc',        label: '기타' },
];

const INTEREST_OPTIONS = [
    { value: 'it',       label: 'IT / 개발',      emoji: '💻' },
    { value: 'design',   label: '디자인 / UX',    emoji: '🎨' },
    { value: 'data',     label: '데이터 / AI',    emoji: '📊' },
    { value: 'game',     label: '게임 / 콘텐츠',  emoji: '🎮' },
    { value: 'business', label: '경영 / 마케팅',  emoji: '📈' },
    { value: 'science',  label: '과학 / 공학',    emoji: '🔬' },
    { value: 'medical',  label: '의료 / 복지',    emoji: '🏥' },
    { value: 'education',label: '교육 / 상담',    emoji: '📚' },
    { value: 'creative', label: '창작 / 예술',    emoji: '✏️' },
    { value: 'etc',      label: '기타 / 탐색 중', emoji: '🧭' },
];

/* ── 유효성 검사 ─────────────────────────────────────────────── */
function validateStep1(form) {
    const errors = {};
    if (!form.userNm.trim())          errors.userNm   = '이름을 입력해주세요.';
    if (!form.email.trim())           errors.email    = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.email    = '올바른 이메일 형식이 아닙니다.';
    if (!form.password)               errors.password = '비밀번호를 입력해주세요.';
    else if (form.password.length < 8) errors.password = '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm)
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    return errors;
}
function validateStep2(form) {
    const errors = {};
    if (!form.education) errors.education = '최종 학력을 선택해주세요.';
    if (!form.interest)  errors.interest  = '관심 분야를 선택해주세요.';
    return errors;
}

/* ── 비밀번호 강도 ────────────────────────────────────────────── */
function getPasswordStrength(pw) {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8)              score++;
    if (pw.length >= 12)             score++;
    if (/[A-Z]/.test(pw))            score++;
    if (/[0-9]/.test(pw))            score++;
    if (/[^A-Za-z0-9]/.test(pw))     score++;
    if (score <= 1) return { level: 1, label: '매우 약함', color: '#dc2626' };
    if (score <= 2) return { level: 2, label: '약함',     color: '#d97706' };
    if (score <= 3) return { level: 3, label: '보통',     color: '#2563eb' };
    if (score <= 4) return { level: 4, label: '강함',     color: '#059669' };
    return             { level: 5, label: '매우 강함',   color: '#059669' };
}

/* ── 컴포넌트 ────────────────────────────────────────────────── */
export default function SignupPage() {
    const { signup } = useAuth();
    const navigate   = useNavigate();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        userNm: '', email: '', password: '', passwordConfirm: '',
        education: '', interest: '', agreeTerms: false, agreePrivacy: false,
    });
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);
    const [showPw,  setShowPw]  = useState(false);
    const [showPwC, setShowPwC] = useState(false);

    const pwStrength = getPasswordStrength(form.password);

    const set = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }));
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    /* Step 1 → 2 */
    const goStep2 = () => {
        const errs = validateStep1(form);
        if (!form.agreeTerms || !form.agreePrivacy) {
            errs.agree = '필수 약관에 모두 동의해주세요.';
        }
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* Step 2 → 3 (실제 가입 처리) */
    const goStep3 = async () => {
        const errs = validateStep2(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        const result = await signup(form);
        setLoading(false);
        if (result.ok) {
            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setErrors({ api: result.error });
        }
    };

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <div className="signup-page">

            {/* 상단 헤더 바 */}
            <div className="signup-topbar">
                <Link to="/" className="signup-logo">
                    <div className="logo-mark" style={{ width: 28, height: 28, borderRadius: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                    </div>
                    <span className="logo-text">CareerNet</span>
                </Link>
                <span className="signup-topbar-right">
                    이미 회원이신가요?&nbsp;
                    <Link to="/" className="signup-login-link">로그인</Link>
                </span>
            </div>

            {/* 본문 2열 레이아웃 */}
            <div className="signup-layout">

                {/* ── 왼쪽: 브랜드 패널 ── */}
                <aside className="signup-brand">
                    <div className="signup-brand-inner">
                        <div className="signup-brand-badge">무료 회원가입</div>
                        <h1 className="signup-brand-title">
                            나만의 진로를<br />지금 시작하세요
                        </h1>
                        <p className="signup-brand-desc">
                            적성검사부터 직업 탐색,<br />
                            1:1 멘토링까지 한 곳에서.
                        </p>

                        {/* 기능 하이라이트 */}
                        <ul className="signup-features">
                            {[
                                { emoji: '🎯', text: 'Holland·Big Five 등 4종 적성검사' },
                                { emoji: '🤖', text: 'AI 앙상블 직업 매칭 알고리즘' },
                                { emoji: '🗺️', text: '단계별 진로 로드맵 설계' },
                                { emoji: '🤝', text: '현직자 1:1 멘토링 매칭' },
                            ].map(({ emoji, text }) => (
                                <li key={text} className="signup-feature-item">
                                    <span className="signup-feature-emoji">{emoji}</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* 스텝 진행 표시 */}
                        <div className="signup-step-indicator">
                            {STEPS.map((label, i) => {
                                const n = i + 1;
                                const isDone    = step > n;
                                const isActive  = step === n;
                                return (
                                    <div key={label} className="signup-step-row">
                                        <div className={`signup-step-circle ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                                            {isDone ? '✓' : n}
                                        </div>
                                        <span className={`signup-step-label ${isActive ? 'active' : isDone ? 'done' : ''}`}>
                                            {label}
                                        </span>
                                        {i < STEPS.length - 1 && (
                                            <div className={`signup-step-line ${isDone ? 'done' : ''}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* ── 오른쪽: 폼 영역 ── */}
                <main className="signup-form-area">
                    <div className="signup-card">

                        {/* ── Step 1: 기본 정보 ── */}
                        {step === 1 && (
                            <>
                                <div className="signup-card-header">
                                    <h2 className="signup-card-title">기본 정보 입력</h2>
                                    <p className="signup-card-desc">CareerNet 계정을 만들어드릴게요.</p>
                                </div>

                                <div className="signup-fields">
                                    {/* 이름 */}
                                    <div className="signup-field">
                                        <label className="signup-label">이름 <span className="req">*</span></label>
                                        <input
                                            className={`signup-input ${errors.userNm ? 'error' : ''}`}
                                            type="text"
                                            placeholder="홍길동"
                                            value={form.userNm}
                                            onChange={e => set('userNm', e.target.value)}
                                            autoComplete="name"
                                        />
                                        {errors.userNm && <p className="field-error">{errors.userNm}</p>}
                                    </div>

                                    {/* 이메일 */}
                                    <div className="signup-field">
                                        <label className="signup-label">이메일 <span className="req">*</span></label>
                                        <input
                                            className={`signup-input ${errors.email ? 'error' : ''}`}
                                            type="email"
                                            placeholder="example@email.com"
                                            value={form.email}
                                            onChange={e => set('email', e.target.value)}
                                            autoComplete="email"
                                        />
                                        {errors.email && <p className="field-error">{errors.email}</p>}
                                    </div>

                                    {/* 비밀번호 */}
                                    <div className="signup-field">
                                        <label className="signup-label">비밀번호 <span className="req">*</span></label>
                                        <div className="signup-input-wrap">
                                            <input
                                                className={`signup-input ${errors.password ? 'error' : ''}`}
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="8자 이상 입력"
                                                value={form.password}
                                                onChange={e => set('password', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                            <button type="button" className="pw-toggle"
                                                    onClick={() => setShowPw(v => !v)}>
                                                {showPw ? '숨김' : '표시'}
                                            </button>
                                        </div>
                                        {/* 강도 바 */}
                                        {form.password && (
                                            <div className="pw-strength-wrap">
                                                <div className="pw-strength-bar">
                                                    {[1,2,3,4,5].map(lv => (
                                                        <div key={lv} className="pw-strength-seg"
                                                             style={{ background: lv <= pwStrength.level ? pwStrength.color : '#e5e7eb' }} />
                                                    ))}
                                                </div>
                                                <span className="pw-strength-label" style={{ color: pwStrength.color }}>
                                                    {pwStrength.label}
                                                </span>
                                            </div>
                                        )}
                                        {errors.password && <p className="field-error">{errors.password}</p>}
                                    </div>

                                    {/* 비밀번호 확인 */}
                                    <div className="signup-field">
                                        <label className="signup-label">비밀번호 확인 <span className="req">*</span></label>
                                        <div className="signup-input-wrap">
                                            <input
                                                className={`signup-input ${errors.passwordConfirm ? 'error' : form.passwordConfirm && form.password === form.passwordConfirm ? 'success' : ''}`}
                                                type={showPwC ? 'text' : 'password'}
                                                placeholder="비밀번호를 다시 입력"
                                                value={form.passwordConfirm}
                                                onChange={e => set('passwordConfirm', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                            <button type="button" className="pw-toggle"
                                                    onClick={() => setShowPwC(v => !v)}>
                                                {showPwC ? '숨김' : '표시'}
                                            </button>
                                        </div>
                                        {form.passwordConfirm && form.password === form.passwordConfirm && (
                                            <p className="field-success">✓ 비밀번호가 일치합니다.</p>
                                        )}
                                        {errors.passwordConfirm && <p className="field-error">{errors.passwordConfirm}</p>}
                                    </div>

                                    {/* 약관 동의 */}
                                    <div className="signup-agree-section">
                                        <label className="agree-row all">
                                            <input type="checkbox"
                                                   checked={form.agreeTerms && form.agreePrivacy}
                                                   onChange={e => {
                                                       set('agreeTerms', e.target.checked);
                                                       set('agreePrivacy', e.target.checked);
                                                   }} />
                                            <span className="agree-all-label">전체 동의</span>
                                        </label>
                                        <div className="agree-divider" />
                                        <label className="agree-row">
                                            <input type="checkbox" checked={form.agreeTerms}
                                                   onChange={e => set('agreeTerms', e.target.checked)} />
                                            <span>[필수] 서비스 이용약관 동의</span>
                                            <a href="#" className="agree-link">보기</a>
                                        </label>
                                        <label className="agree-row">
                                            <input type="checkbox" checked={form.agreePrivacy}
                                                   onChange={e => set('agreePrivacy', e.target.checked)} />
                                            <span>[필수] 개인정보 처리방침 동의</span>
                                            <a href="#" className="agree-link">보기</a>
                                        </label>
                                        {errors.agree && <p className="field-error">{errors.agree}</p>}
                                    </div>
                                </div>

                                <button className="signup-btn-main" onClick={goStep2}>
                                    다음 단계 →
                                </button>
                                <p className="signup-login-hint">
                                    이미 회원이신가요?{' '}
                                    <Link to="/" className="signup-login-link">로그인</Link>
                                </p>
                            </>
                        )}

                        {/* ── Step 2: 진로 정보 ── */}
                        {step === 2 && (
                            <>
                                <div className="signup-card-header">
                                    <h2 className="signup-card-title">진로 정보 입력</h2>
                                    <p className="signup-card-desc">
                                        맞춤형 진로 추천을 위해 조금 더 알려주세요.
                                    </p>
                                </div>

                                <div className="signup-fields">
                                    {/* 최종 학력 */}
                                    <div className="signup-field">
                                        <label className="signup-label">최종 학력 <span className="req">*</span></label>
                                        <select
                                            className={`signup-input ${errors.education ? 'error' : ''}`}
                                            value={form.education}
                                            onChange={e => set('education', e.target.value)}
                                        >
                                            {EDUCATION_OPTIONS.map(({ value, label }) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        {errors.education && <p className="field-error">{errors.education}</p>}
                                    </div>

                                    {/* 관심 분야 (카드 선택) */}
                                    <div className="signup-field">
                                        <label className="signup-label">
                                            관심 분야 <span className="req">*</span>
                                            <span className="signup-label-hint"> — 1개 선택 (나중에 변경 가능)</span>
                                        </label>
                                        <div className="interest-grid">
                                            {INTEREST_OPTIONS.map(({ value, label, emoji }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className={`interest-card ${form.interest === value ? 'selected' : ''}`}
                                                    onClick={() => set('interest', value)}
                                                >
                                                    <span className="interest-emoji">{emoji}</span>
                                                    <span className="interest-label">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.interest && <p className="field-error">{errors.interest}</p>}
                                    </div>

                                    {errors.api && (
                                        <div className="signup-api-error">{errors.api}</div>
                                    )}
                                </div>

                                <div className="signup-btn-row">
                                    <button className="signup-btn-back" onClick={() => setStep(1)}>
                                        ← 이전
                                    </button>
                                    <button className="signup-btn-main flex1" onClick={goStep3} disabled={loading}>
                                        {loading ? '처리 중...' : '가입 완료하기'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── Step 3: 완료 ── */}
                        {step === 3 && (
                            <div className="signup-complete">
                                <div className="signup-complete-icon">🎉</div>
                                <h2 className="signup-complete-title">
                                    환영합니다, {form.userNm}님!
                                </h2>
                                <p className="signup-complete-desc">
                                    CareerNet 회원이 되셨습니다.<br />
                                    지금 바로 진로 탐색을 시작해보세요.
                                </p>

                                {/* 추천 다음 행동 */}
                                <div className="signup-next-actions">
                                    <button className="signup-next-btn primary"
                                            onClick={() => navigate('/design')}>
                                        <span>🎯</span>
                                        <div>
                                            <strong>적성검사 시작하기</strong>
                                            <small>나에게 맞는 직업을 찾아보세요</small>
                                        </div>
                                    </button>
                                    <button className="signup-next-btn"
                                            onClick={() => navigate('/')}>
                                        <span>🏠</span>
                                        <div>
                                            <strong>메인 페이지로</strong>
                                            <small>직업·학과 정보 탐색하기</small>
                                        </div>
                                    </button>
                                </div>

                                <p className="signup-complete-email-note">
                                    가입 이메일: <strong>{form.email}</strong>
                                </p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}