'use client';

import { ConfigProvider, App } from 'antd';
import theme from '@/theme/themeConfig';
import ErrorBoundary from './ErrorBoundary';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <div className="min-h-screen flex flex-col">
            <ErrorBoundary>
                <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
                    <ConfigProvider theme={theme}>
                        <App>
                            {children}
                        </App>
                    </ConfigProvider>
                </AuthContext.Provider>
            </ErrorBoundary>
        </div>
    );
}
