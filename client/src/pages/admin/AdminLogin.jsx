import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Stack,
    alpha,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    AdminPanelSettings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { USER_TYPES } from '../../utils/constants';
import { adminLoginSchema } from '../../utils/validationSchemas';

const MotionPaper = motion(Paper);

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
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
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <MotionPaper
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    elevation={24}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: alpha('#f59e0b', 0.2),
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <AdminPanelSettings sx={{ fontSize: 40, color: 'secondary.main' }} />
                        </Box>
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            Admin Login
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Access the admin dashboard
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Admin Email"
                                type="email"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    },
                                }}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>
                        </Stack>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
