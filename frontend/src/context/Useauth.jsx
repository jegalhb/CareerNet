// src/context/Useauth.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiErrorMessage, getUser, loginUser, signupUser } from '../api/careernetApi';

const AuthContext = createContext(null);

const STORAGE_KEY = 'careernet_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setLoading] = useState(true);

    useEffect(() => {
        const restoreUser = async () => {
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (!saved?.userId) {
                    return;
                }
                const freshUser = await getUser(saved.userId);
                setUser(freshUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const signup = async (formData) => {
        try {
            const newUser = await signupUser({
                userNm: formData.userNm,
                email: formData.email,
                password: formData.password,
                education: formData.education || '',
                interest: formData.interest || '',
            });
            login(newUser);
            return { ok: true, user: newUser };
        } catch (error) {
            return { ok: false, error: getApiErrorMessage(error) };
        }
    };

    const loginWithCredentials = async (email, password) => {
        try {
            const loggedInUser = await loginUser(email, password);
            login(loggedInUser);
            return { ok: true, user: loggedInUser };
        } catch (error) {
            return { ok: false, error: getApiErrorMessage(error) };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            authLoading,
            login,
            logout,
            signup,
            loginWithCredentials,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
    }
    return ctx;
}
