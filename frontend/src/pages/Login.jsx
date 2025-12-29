import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, Typography, Card } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    LoginOutlined,
    UserAddOutlined,
    ScissorOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import './Login.css';

const { Title, Text, Paragraph } = Typography;
const MotionDiv = motion.div;

const Login = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 'signup' : 'login');
    const [loading, setLoading] = useState(false);

    const [loginForm] = Form.useForm();
    const [signupForm] = Form.useForm();

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { success, error: showError } = useToast();

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
            showError(err.response?.data?.message || 'Login failed. Please try again.');
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
                setActiveTab('login');
                success('Registration successful! Please login.');
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: 'login',
            label: (
                <span className="tab-label">
                    <LoginOutlined /> Login
                </span>
            ),
            children: (
                <Form form={loginForm} onFinish={onLoginSubmit} layout="vertical" size="large">
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<LoginOutlined />}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'signup',
            label: (
                <span className="tab-label">
                    <UserAddOutlined /> Sign Up
                </span>
            ),
            children: (
                <Form form={signupForm} onFinish={onSignupSubmit} layout="vertical" size="large">
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter your phone number' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" maxLength={10} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<UserAddOutlined />}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className="login-page-modern">
            <div className="login-bg-pattern" />
            <div className="login-container-modern">
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="login-content"
                >
                    {/* Logo/Brand */}
                    <div className="login-brand">
                        <ScissorOutlined className="brand-icon" />
                        <Title level={2} className="brand-title">STYLER</Title>
                        <Text className="brand-subtitle">Premium Grooming Services</Text>
                    </div>

                    {/* Auth Card */}
                    <Card className="auth-card-modern" bordered={false}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            centered
                            className="auth-tabs"
                        />
                    </Card>

                    {/* Footer Text */}
                    <Paragraph className="login-footer-text">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Paragraph>
                </MotionDiv>
            </div>
        </div>
    );
};

export default Login;
