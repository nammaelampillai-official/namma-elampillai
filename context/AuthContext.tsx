'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, getUsers, addUser, findUser } from '@/lib/dataStore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for active session
        const session = localStorage.getItem('user_session');
        if (session) {
            try {
                setUser(JSON.parse(session));
            } catch (e) {
                localStorage.removeItem('user_session');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const user = findUser(email);
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }

        setUser(user);
        localStorage.setItem('user_session', JSON.stringify(user));
        router.push('/');
    };

    const signup = async (name: string, email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const newUser = addUser({ name, email, password });
            setUser(newUser);
            localStorage.setItem('user_session', JSON.stringify(newUser));
            router.push('/');
        } catch (error: any) {
            throw new Error(error.message || 'Failed to creates account');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_session');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
