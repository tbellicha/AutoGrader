import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  token: string | null;
  studentId: string | null;
  teacherId: string | null;
  setAuthData: (token: string | null, studentId: string | null, teacherId: string | null) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const setAuthData = (newToken: string | null, newStudentId: string | null, newTeacherId: string | null) => {
    setToken(newToken);
    setStudentId(newStudentId);
    setTeacherId(newTeacherId);
  };
  

  return (
    <AuthContext.Provider value={{ token, studentId, teacherId, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};