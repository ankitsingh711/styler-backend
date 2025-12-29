import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { USER_TYPES } from '../../utils/constants';
import './AdminLogin.css';

const { Title, Text } = Typography;
const MotionCard = motion(Card);

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { success, error: showError } = useToast();

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await authService.adminLogin({
                email: values.email,
                password: values.password,
            });

            login({
                token: response.token,
                refreshToken: response.refreshToken,
                email: values.email,
                userType: USER_TYPES.ADMIN,
                name: response.username || 'Admin',
            });

            success('Admin login successful! Welcome back.');
            setTimeout(() => navigate('/admin/dashboard'), 500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid admin credentials';
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <MotionCard
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="admin-login-card"
                >
                    {/* Header */}
                    <div className="admin-login-header">
                        <div className="admin-icon-wrapper">
                            <SafetyCertificateOutlined className="admin-shield-icon" />
                        </div>
                        <Title level={2} className="admin-login-title">
                            Admin Login
                        </Title>
                        <Text type="secondary" className="admin-login-subtitle">
                            Access the admin dashboard
                        </Text>
                    </div>

                    {/* Form */}
                    <Form
                        name="admin-login"
                        onFinish={onSubmit}
                        layout="vertical"
                        size="large"
                        className="admin-login-form"
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
                                placeholder="admin@email.com"
                                type="email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter yourpassword' },
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
                                className="admin-login-btn"
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </MotionCard>
            </div>
        </div>
    );
};

export default AdminLogin;
