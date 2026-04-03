import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: any;
  avatar: string | null;
  login: (userData: any) => void;
  logout: () => void;
  updateAvatar: (url: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  avatar: null,
  login: () => {},
  logout: () => {},
  updateAvatar: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      const savedAvatar = localStorage.getItem(`avatar_${parsedUser._id}`);
      setAvatar(savedAvatar || `https://ui-avatars.com/api/?name=${parsedUser.name}&background=6366f1&color=fff&size=100`);
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    const savedAvatar = localStorage.getItem(`avatar_${userData._id}`);
    setAvatar(savedAvatar || `https://ui-avatars.com/api/?name=${userData.name}&background=6366f1&color=fff&size=100`);
  };

  const logout = () => {
    setUser(null);
    setAvatar(null);
    localStorage.removeItem('userInfo');
  };

  const updateAvatar = (url: string) => {
    setAvatar(url);
    if (user) {
      localStorage.setItem(`avatar_${user._id}`, url);
    }
  };

  return (
    <AuthContext.Provider value={{ user, avatar, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
