// src/context/useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext
 * ─────────────────────────────────────────────────────────────
 * 전역 인증 상태를 관리하는 Context.
 * Zustand 없이 React Context + localStorage로 구현하여
 * 외부 의존성 최소화.
 *
 * 제공 값:
 *   user          : { userId, userNm, email, education, interest } | null
 *   isLoggedIn    : boolean
 *   login(user)   : 로그인 처리 (서버 응답 user 객체 전달)
 *   logout()      : 로그아웃
 *   signup(data)  : 회원가입 처리 (현재 mock — 백엔드 연동 시 API 교체)
 *   authLoading   : 초기화 중 여부 (깜빡임 방지)
 */

const AuthContext = createContext(null);

const STORAGE_KEY = 'careernet_user';

export function AuthProvider({ children }) {
    const [user, setUser]           = useState(null);
    const [authLoading, setLoading] = useState(true); // localStorage 복원 중

    /* 앱 시작 시 localStorage에서 사용자 정보 복원 */
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setUser(JSON.parse(saved));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── 로그인 ──────────────────────────────────────────── */
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    };

    /* ── 로그아웃 ────────────────────────────────────────── */
    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    /**
     * signup(formData) — 회원가입
     *
     * 현재: localStorage mock 저장 후 자동 로그인
     * 백엔드 연동 시:
     *   const res = await api.post('/auth/signup', formData);
     *   login(res.data.user);
     *
     * @param {{ userNm, email, password, education, interest }} formData
     * @returns {{ ok: boolean, error?: string }}
     */
    const signup = async (formData) => {
        try {
            // ── Mock 중복 이메일 체크 ──────────────────────
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (existing && existing.email === formData.email) {
                return { ok: false, error: '이미 사용 중인 이메일입니다.' };
            }

            // ── Mock 사용자 생성 ───────────────────────────
            const newUser = {
                userId    : Date.now(),
                userNm    : formData.userNm,
                email     : formData.email,
                education : formData.education || '',
                interest  : formData.interest  || '',
                createdAt : new Date().toISOString(),
            };

            // 실제 프로젝트에서는 여기서 API 호출 후 응답 user로 교체
            login(newUser);
            return { ok: true };
        } catch (err) {
            return { ok: false, error: '회원가입 처리 중 오류가 발생했습니다.' };
        }
    };

    /**
     * loginWithCredentials(email, password)
     *
     * 현재: localStorage에 저장된 사용자 정보와 비교 (mock)
     * 백엔드 연동 시:
     *   const res = await api.post('/auth/login', { email, password });
     *   login(res.data.user);
     */
    const loginWithCredentials = async (email, password) => {
        try {
            // Mock: 저장된 계정과 대조
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (saved && saved.email === email) {
                login(saved);
                return { ok: true };
            }
            // 테스트 계정 (개발용)
            if (email === 'test@careernet.kr' && password === 'test1234') {
                const testUser = {
                    userId: 1, userNm: '테스트 사용자',
                    email: 'test@careernet.kr',
                    education: 'university', interest: 'it',
                };
                login(testUser);
                return { ok: true };
            }
            return { ok: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
        } catch {
            return { ok: false, error: '로그인 처리 중 오류가 발생했습니다.' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user, isLoggedIn: !!user, authLoading,
            login, logout, signup, loginWithCredentials,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

/* 커스텀 훅 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
    return ctx;
}