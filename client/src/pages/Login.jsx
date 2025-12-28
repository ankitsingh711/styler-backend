import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import { userLoginSchema, userRegisterSchema } from '../utils/validationSchemas';
import './Login.css';

const Login = ({ isRegisterMode = false }) => {
    const [isLogin, setIsLogin] = useState(!isRegisterMode);

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { success, error: showError } = useToast();

    // Use different schemas based on login/register mode
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(isLogin ? userLoginSchema : userRegisterSchema),
        mode: 'onBlur'
    });

    // Switch between login and register, reset form when switching
    const switchMode = (loginMode) => {
        setIsLogin(loginMode);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
                // Login
                const response = await authService.login({
                    email: data.email,
                    password: data.password,
                });

                authLogin({
                    token: response.token,
                    refreshToken: response.refreshToken,
                    email: data.email,
                    userType: USER_TYPES.USER,
                    name: response.username || data.email,
                });

                success('Login successful! Welcome back.');

                setTimeout(() => {
                    navigate('/profile');
                }, 500);
            } else {
                // Register
                const response = await authService.register({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                });

                // Auto-login after registration
                if (response.token) {
                    authLogin({
                        token: response.token,
                        refreshToken: response.refreshToken,
                        email: data.email,
                        userType: USER_TYPES.USER,
                        name: data.name,
                    });
                    success('Account created successfully! Welcome aboard.');

                    setTimeout(() => {
                        navigate('/profile');
                    }, 500);
                } else {
                    // If no auto-login, switch to login form
                    switchMode(true);
                    success('Registration successful! Please login.');
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            showError(errorMessage);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Login to book your appointment' : 'Sign up to get started'}</p>
                </div>

                <div className="login-tabs">
                    <button
                        type="button"
                        className={isLogin ? 'active' : ''}
                        onClick={() => switchMode(true)}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? 'active' : ''}
                        onClick={() => switchMode(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                {...register('name')}
                                placeholder="Enter your full name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && (
                                <span className="error-message">{errors.name.message}</span>
                            )}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            placeholder="Enter your email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                {...register('phone')}
                                placeholder="Enter your phone number"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && (
                                <span className="error-message">{errors.phone.message}</span>
                            )}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            placeholder="Enter your password"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
