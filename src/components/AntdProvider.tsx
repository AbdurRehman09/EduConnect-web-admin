'use client';

import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider theme={theme}>
            {children}
        </ConfigProvider>
    );
}
