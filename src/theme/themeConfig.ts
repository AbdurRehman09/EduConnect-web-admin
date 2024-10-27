import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        colorPrimary: '#5C8307',
        colorBgContainer: '#D4E2B6',
        colorPrimaryBg: '#F9F1A5',
    },
    components: {
        Table: {
            headerBg: '#5C8307',
            headerColor: '#FFFFFF',
        },
        Modal: {
            contentBg: '#FFFFE0',
        },
    },
};

export default theme;
