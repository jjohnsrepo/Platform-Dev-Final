import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import {
  cognitoSignIn,
  cognitoSignUp,
  cognitoConfirmSignUp,
  cognitoSignOut,
  cognitoGetCurrentUser,
} from '@/services/cognitoAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    cognitoGetCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const u = await cognitoSignIn(email, password);
    setUser(u);
  }

  async function signup(email: string, password: string, username: string) {
    return cognitoSignUp(email, password, username);
  }

  async function confirmSignUp(email: string, code: string) {
    await cognitoConfirmSignUp(email, code);
  }

  async function logout() {
    await cognitoSignOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, confirmSignUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
