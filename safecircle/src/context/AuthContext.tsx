import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, userApi, registerSessionExpiredHandler } from '@/api';
import { tokenStorage } from '@/utils/tokenStorage';
import { socketService } from '@/services/socketService';
import type { LoginRequest, RegisterRequest, UserResponse } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => tokenStorage.getStoredUser<UserResponse>());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    socketService.disconnect();
    setUser(null);
  }, []);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setUser(null);
      socketService.disconnect();
      toast.error('Your session has expired. Please sign in again.');
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await userApi.getCurrentUser();
      setUser(res.data);
      tokenStorage.setStoredUser(res.data);
    } catch {
      tokenStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authApi.login(payload);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Login failed');
    }
    const { token, refreshToken, userId, fullName, email } = res.data;
    tokenStorage.setTokens(token, refreshToken);

    // Populate a minimal user immediately, then hydrate full profile
    const minimalUser = {
      id: userId,
      fullName,
      email,
    } as UserResponse;
    setUser(minimalUser);
    tokenStorage.setStoredUser(minimalUser);

    try {
      const me = await userApi.getCurrentUser();
      setUser(me.data);
      tokenStorage.setStoredUser(me.data);
    } catch {
      // keep minimal user if /users/me fails
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await authApi.register(payload);
    if (!res.success) {
      throw new Error(res.message || 'Registration failed');
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
