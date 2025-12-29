import { theme } from 'antd';

const { darkAlgorithm } = theme;

export const antdTheme = {
    token: {
        // Colors
        colorPrimary: '#f59e0b', // Amber/Orange
        colorSuccess: '#10b981', // Green
        colorWarning: '#f59e0b', // Amber
        colorError: '#ef4444', // Red
        colorInfo: '#3b82f6', // Blue

        // Background & Text
        colorBgBase: '#0f172a', // Dark blue background
        colorBgContainer: '#1e293b', // Slightly lighter dark background
        colorBgElevated: '#334155', // Card/modal backgrounds
        colorText: '#f1f5f9', // Light text
        colorTextSecondary: '#94a3b8', // Secondary text

        // Border & Radius
        borderRadius: 12,
        borderRadiusLG: 16,
        borderRadiusSM: 8,

        // Typography
        fontSize: 16,
        fontSizeHeading1: 48,
        fontSizeHeading2: 36,
        fontSizeHeading3: 28,
        fontSizeHeading4: 22,
        fontSizeHeading5: 18,

        // Spacing
        padding: 16,
        paddingLG: 24,
        paddingXL: 32,

        // Shadow
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        boxShadowSecondary: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    },

    algorithm: darkAlgorithm,

    components: {
        Button: {
            controlHeight: 44,
            controlHeightLG: 52,
            fontWeight: 600,
            primaryShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
        },
        Input: {
            controlHeight: 44,
            controlHeightLG: 52,
            borderRadius: 8,
        },
        Select: {
            controlHeight: 44,
            controlHeightLG: 52,
        },
        Card: {
            borderRadius: 16,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
        },
        Modal: {
            borderRadius: 16,
        },
        Table: {
            borderRadius: 12,
        },
    },
};
