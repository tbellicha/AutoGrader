import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEACHER_DASHBOARD_PATH = "/TeacherDashboard";
const STUDENT_DASHBOARD_PATH = "/StudentDashboard";

const TEACHER_ROLE = "TEACHER";
const STUDENT_ROLE = "STUDENT";

type User = {
    id: string;
    role: string;
    email: string;
    student_id?: string;
    teacher_id?: string;
}

interface UserContextProps {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    setUserData: (user: User | null) => void;
}

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const login = (userData: User) => {
        setUserData(userData);

        console.log(`User Role: ${userData.role}`);

        if (userData.role === TEACHER_ROLE) {
            navigate(TEACHER_DASHBOARD_PATH);
        } else if (userData.role === STUDENT_ROLE) {
            navigate(STUDENT_DASHBOARD_PATH);
        } else {
            navigate("/");
        }
    }

    const logout = () => {
        setUserData(null);
        navigate("/");
    };

    const setUserData = (userData: User | null) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, login, logout, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };
