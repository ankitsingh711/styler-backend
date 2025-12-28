import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Container,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Tabs,
    Stack,
    Divider,
    rem,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconLock,
    IconPhone,
    IconLogin,
    IconUserPlus,
    IconArrowLeft,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import { userLoginSchema, userRegisterSchema } from '../utils/validationSchemas';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Login = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 'signup' : 'login');
    const isLogin = activeTab === 'login';

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const { success, error: showError } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(isLogin ? userLoginSchema : userRegisterSchema),
        mode: 'onBlur'
    });

    const switchMode = (tab) => {
        setActiveTab(tab);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
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
                setTimeout(() => navigate('/profile'), 500);
            } else {
                const response = await authService.register({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                });

                if (response.token) {
                    authLogin({
                        token: response.token,
                        refreshToken: response.refreshToken,
                        email: data.email,
                        userType: USER_TYPES.USER,
                        name: data.name,
                    });
                    success('Account created successfully! Welcome aboard.');
                    setTimeout(() => navigate('/profile'), 500);
                } else {
                    switchMode('login');
                    success('Registration successful! Please login.');
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            showError(errorMessage);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                padding: '2rem 0',
            }}
        >
            <Container size="sm">
                <MotionPaper
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    shadow="xl"
                    p="xl"
                    radius="lg"
                >
                    {/* Header */}
                    <Box style={{ marginBottom: rem(32), textAlign: 'center' }}>
                        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: rem(24) }}>
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 50, width: 'auto' }}
                            />
                        </Box>
                        <Title order={2} fw={800} mb="xs">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Title>
                        <Text c="dimmed">
                            {isLogin ? 'Login to book your appointment' : 'Sign up to get started'}
                        </Text>
                    </Box>

                    {/* Tabs */}
                    <Tabs value={activeTab} onChange={switchMode} mb="xl">
                        <Tabs.List grow>
                            <Tabs.Tab value="login" leftSection={<IconLogin size={16} />}>
                                Login
                            </Tabs.Tab>
                            <Tabs.Tab value="signup" leftSection={<IconUserPlus size={16} />}>
                                Sign Up
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            <MotionBox
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Stack gap="md">
                                    {!isLogin && (
                                        <TextInput
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            leftSection={<IconUser size={16} />}
                                            {...register('name')}
                                            error={errors.name?.message}
                                        />
                                    )}

                                    <TextInput
                                        label="Email Address"
                                        placeholder="your@email.com"
                                        type="email"
                                        leftSection={<IconMail size={16} />}
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />

                                    {!isLogin && (
                                        <TextInput
                                            label="Phone Number"
                                            placeholder="+91 XXXXX XXXXX"
                                            leftSection={<IconPhone size={16} />}
                                            {...register('phone')}
                                            error={errors.phone?.message}
                                        />
                                    )}

                                    <PasswordInput
                                        label="Password"
                                        placeholder="Enter your password"
                                        leftSection={<IconLock size={16} />}
                                        {...register('password')}
                                        error={errors.password?.message}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        color="amber"
                                        loading={isSubmitting}
                                        styles={{
                                            root: {
                                                fontWeight: 700,
                                            },
                                        }}
                                    >
                                        {isLogin ? 'Login' : 'Sign Up'}
                                    </Button>
                                </Stack>
                            </MotionBox>
                        </AnimatePresence>
                    </Box>

                    <Divider my="xl" />

                    {/* Footer */}
                    <Box style={{ textAlign: 'center' }}>
                        <Button
                            component={Link}
                            to="/"
                            variant="subtle"
                            color="gray"
                            leftSection={<IconArrowLeft size={16} />}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default Login;
