import { createTheme } from '@mantine/core';

export const theme = createTheme({
    /** Primary color palette */
    primaryColor: 'amber',

    /** Color scheme */
    colors: {
        amber: [
            '#fff9e6',
            '#fff3cc',
            '#ffe699',
            '#ffd966',
            '#ffcc33',
            '#f59e0b', // Main amber/gold color
            '#d97706',
            '#b45309',
            '#92400e',
            '#78350f',
        ],
    },

    /** Font family */
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: '700',
        sizes: {
            h1: { fontSize: '2.5rem', lineHeight: '1.2' },
            h2: { fontSize: '2rem', lineHeight: '1.3' },
            h3: { fontSize: '1.75rem', lineHeight: '1.4' },
            h4: { fontSize: '1.5rem', lineHeight: '1.4' },
            h5: { fontSize: '1.25rem', lineHeight: '1.5' },
            h6: { fontSize: '1rem', lineHeight: '1.5' },
        },
    },

    /** Spacing */
    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },

    /** Border radius */
    radius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
    },

    /** Shadows */
    shadows: {
        xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },

    /** Component defaults */
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
            styles: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
            },
        },
    },

    /** Other theme properties */
    white: '#ffffff',
    black: '#1e293b',

    defaultRadius: 'md',

    /** Breakpoints */
    breakpoints: {
        xs: '36em',
        sm: '48em',
        md: '62em',
        lg: '75em',
        xl: '88em',
    },
});
