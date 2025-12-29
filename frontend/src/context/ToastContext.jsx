import { createContext, useContext, useCallback } from 'react';
import { message } from 'antd';

const ToastContext = createContext(null);

// Configure message globally
message.config({
    top: 80,
    duration: 3,
    maxCount: 3,
});

export const ToastProvider = ({ children }) => {
    const success = useCallback((msg, duration = 3) => {
        return message.success(msg, duration);
    }, []);

    const error = useCallback((msg, duration = 3) => {
        return message.error(msg, duration);
    }, []);

    const warning = useCallback((msg, duration = 3) => {
        return message.warning(msg, duration);
    }, []);

    const info = useCallback((msg, duration = 3) => {
        return message.info(msg, duration);
    }, []);

    const loading = useCallback((msg) => {
        return message.loading(msg, 0);
    }, []);

    return (
        <ToastContext.Provider
            value={{
                success,
                error,
                warning,
                info,
                loading,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
