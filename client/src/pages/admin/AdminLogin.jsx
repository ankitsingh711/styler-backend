import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Stack,
    rem,
} from '@mantine/core';
import {
    IconMail,
    IconLock,
    IconShieldLock,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { USER_TYPES } from '../../utils/constants';
import { adminLoginSchema } from '../../utils/validationSchemas';

const MotionPaper = motion(Paper);

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { success, error: showError } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(adminLoginSchema),
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        try {
            const response = await authService.adminLogin({
                email: data.email,
                password: data.password,
            });

            login({
                token: response.token,
                refreshToken: response.refreshToken,
                email: data.email,
                userType: USER_TYPES.ADMIN,
                name: response.username || 'Admin',
            });

            success('Admin login successful! Welcome back.');
            setTimeout(() => navigate('/admin/dashboard'), 500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid admin credentials';
            showError(errorMessage);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
                    style={{
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                >
                    {/* Header */}
                    <Box style={{ marginBottom: rem(32), textAlign: 'center' }}>
                        <Box
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginBottom: rem(24),
                            }}
                        >
                            <IconShieldLock size={40} color="#f59e0b" />
                        </Box>
                        <Title order={2} fw={800} mb="xs">
                            Admin Login
                        </Title>
                        <Text c="dimmed">
                            Access the admin dashboard
                        </Text>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Admin Email"
                                placeholder="admin@email.com"
                                type="email"
                                leftSection={<IconMail size={16} />}
                                {...register('email')}
                                error={errors.email?.message}
                            />

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
                                loading={isSubmitting}
                                styles={{
                                    root: {
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                        },
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
