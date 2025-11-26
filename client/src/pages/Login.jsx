import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import './Login.css';

const Login = ({ isRegisterMode = false }) => {
    const [isLogin, setIsLogin] = useState(!isRegisterMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { success, error: showError } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const response = await authService.login({
                    email: formData.email,
                    password: formData.password,
                });

                authLogin({
                    token: response.token,
                    refreshToken: response.refreshToken,
                    email: formData.email,
                    userType: USER_TYPES.USER,
                    name: response.username || formData.email,
                });

                success('Login successful! Welcome back.');
                
                setTimeout(() => {
                    navigate('/profile');
                }, 500);
            } else {
                // Register
                const response = await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                });

                // Auto-login after registration
                if (response.token) {
                    authLogin({
                        token: response.token,
                        refreshToken: response.refreshToken,
                        email: formData.email,
                        userType: USER_TYPES.USER,
                        name: formData.name,
                    });
                    success('Account created successfully! Welcome aboard.');
                    
                    setTimeout(() => {
                        navigate('/profile');
                    }, 500);
                } else {
                    // If no auto-login, switch to login form
                    setIsLogin(true);
                    success('Registration successful! Please login.');
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            showError(errorMessage);
        } finally {
            setLoading(false);
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
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required={!isLogin}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
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
