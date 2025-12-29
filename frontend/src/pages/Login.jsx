import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Tabs, Typography, Space, Card } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    LoginOutlined,
    UserAddOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import './Login.css';

const { Title, Text } = Typography;

const MotionCard = motion(Card);

const Login = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 'signup' : 'login');
    const [loading, setLoading] = useState(false);
    const isLogin = activeTab === 'login';

    const [loginForm] = Form.useForm();
    const [signupForm] = Form.useForm();

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { success, error: showError } = useToast();

    const switchMode = (tab) => {
        setActiveTab(tab);
        loginForm.resetFields();
        signupForm.resetFields();
    };

    const onLoginSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await authService.login({
                email: values.email,
                password: values.password,
            });

            authLogin({
                token: response.token,
                refreshToken: response.refreshToken,
                email: values.email,
                userType: USER_TYPES.USER,
                name: response.username || values.email,
            });

            success('Login successful! Welcome back.');
            setTimeout(() => navigate('/profile'), 500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onSignupSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
            });

            if (response.token) {
                authLogin({
                    token: response.token,
                    refreshToken: response.refreshToken,
                    email: values.email,
                    userType: USER_TYPES.USER,
                    name: values.name,
                });
                success('Account created successfully! Welcome aboard.');
                setTimeout(() => navigate('/profile'), 500);
            } else {
                switchMode('login');
                success('Registration successful! Please login.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: 'login',
            label: (
                <span>
                    <LoginOutlined /> Login
                </span>
            ),
        },
        {
            key: 'signup',
            label: (
                <span>
                    <UserAddOutlined /> Sign Up
                </span>
            ),
        },
    ];

    return (
        <div className="login-page">
            <div className="login-container-wrapper">
                <MotionCard
                    className="login-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo-container">
                        </div>
                        <Title level={2} className="login-title">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Title>
                        <Text type="secondary" className="login-subtitle">
                            {isLogin ? 'Login to book your appointment' : 'Sign up to get started'}
                        </Text>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={switchMode}
                        items={tabItems}
                        centered
                        size="large"
                        className="login-tabs"
                    />

                    {/* Login Form */}
                    {isLogin ? (
                        <Form
                            form={loginForm}
                            name="login"
                            onFinish={onLoginSubmit}
                            autoComplete="off"
                            layout="vertical"
                            size="large"
                            className="login-form"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="your@email.com"
                                    type="email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter your password' },
                                    { min: 6, message: 'Password must be at least 6 characters' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter your password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    loading={loading}
                                    className="submit-button"
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        /* Signup Form */
                        <Form
                            form={signupForm}
                            name="signup"
                            onFinish={onSignupSubmit}
                            autoComplete="off"
                            layout="vertical"
                            size="large"
                            className="login-form"
                        >
                            <Form.Item
                                name="name"
                                rules={[
                                    { required: true, message: 'Please enter your full name' },
                                    { min: 2, message: 'Name must be at least 2 characters' },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Enter your full name"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="your@email.com"
                                    type="email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                rules={[
                                    { required: true, message: 'Please enter your phone number' },
                                    { pattern: /^[0-9+\s-()]+$/, message: 'Please enter a valid phone number' },
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter your password' },
                                    { min: 6, message: 'Password must be at least 6 characters' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter your password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    loading={loading}
                                    className="submit-button"
                                >
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {/* Footer */}
                    <div className="login-footer">
                        <Link to="/">
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                className="back-button"
                            >
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </MotionCard>
            </div>
        </div>
    );
};

export default Login;
