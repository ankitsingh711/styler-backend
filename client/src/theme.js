import { createTheme } from '@mui/material/styles';

// Styler Brand Theme Configuration
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1e293b',      // Deep slate blue
            light: '#334155',
            dark: '#0f172a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f59e0b',      // Amber gold
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#000000',
        },
        accent: {
            main: '#14b8a6',      // Teal
            light: '#2dd4bf',
            dark: '#0d9488',
            contrastText: '#ffffff',
        },
        error: {
            main: '#dc2626',
            light: '#ef4444',
            dark: '#b91c1c',
        },
        success: {
            main: '#16a34a',
            light: '#22c55e',
            dark: '#15803d',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
            disabled: '#9ca3af',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: '3rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h2: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        h3: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
        },
        h4: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.3,
            '@media (max-width:600px)': {
                fontSize: '1.25rem',
            },
        },
        h5: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.3,
        },
        h6: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
            letterSpacing: '0.00938em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontWeight: 600,
            fontSize: '0.9375rem',
            textTransform: 'none',
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 2px 8px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.1)',
        '0 8px 24px rgba(0, 0, 0, 0.12)',
        '0 12px 32px rgba(0, 0, 0, 0.14)',
        '0 16px 48px rgba(0, 0, 0, 0.16)',
        '0 20px 60px rgba(0, 0, 0, 0.18)',
        '0 24px 72px rgba(0, 0, 0, 0.2)',
        // MUI requires 25 shadow values, filling the rest with variations
        '0 2px 8px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.1)',
        '0 8px 24px rgba(0, 0, 0, 0.12)',
        '0 12px 32px rgba(0, 0, 0, 0.14)',
        '0 16px 48px rgba(0, 0, 0, 0.16)',
        '0 20px 60px rgba(0, 0, 0, 0.18)',
        '0 24px 72px rgba(0, 0, 0, 0.2)',
        '0 2px 8px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.1)',
        '0 8px 24px rgba(0, 0, 0, 0.12)',
        '0 12px 32px rgba(0, 0, 0, 0.14)',
        '0 16px 48px rgba(0, 0, 0, 0.16)',
        '0 20px 60px rgba(0, 0, 0, 0.18)',
        '0 24px 72px rgba(0, 0, 0, 0.2)',
        '0 2px 8px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.1)',
        '0 8px 24px rgba(0, 0, 0, 0.12)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    spacing: 8, // Base spacing unit (8px)
});

// Add custom properties to theme
theme.palette.accent = {
    main: '#14b8a6',
    light: '#2dd4bf',
    dark: '#0d9488',
    contrastText: '#ffffff',
};

export default theme;
