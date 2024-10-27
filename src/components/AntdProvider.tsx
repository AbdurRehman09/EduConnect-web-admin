'use client';

import { ConfigProvider, App } from 'antd';
import theme from '@/theme/themeConfig';
import ErrorBoundary from './ErrorBoundary';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <ErrorBoundary>
                <ConfigProvider theme={theme}>
                    <App>
                        {children}
                    </App>
                </ConfigProvider>
            </ErrorBoundary>
        </div>
    );
}
