import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('talkspark-auth') === 'true';
  });
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const login = () => {
    // In a real app, this would redirect to your OIDC provider (Google, Auth0, etc.)
    // window.location.href = "https://oidc-provider.com/auth?...";
    console.log("Simulating OIDC Redirect...");
    setIsAuthenticated(true);
    setUser({ name: 'Admin User', role: 'admin' });
    localStorage.setItem('talkspark-auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('talkspark-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};