import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// 인증 정보 관리
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // 로그인 상태 확인
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (err) {
      console.error('Fetch user error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // 토큰 유효성 검증
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, [token, fetchUser]);

  // 로그인 처리
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  // 인증 정보 제공
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 인증 정보 사용
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
