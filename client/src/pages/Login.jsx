import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Tabs,
    Tab,
    InputAdornment,
    IconButton,
    Alert,
    Stack,
    Divider,
    alpha,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Lock,
    Phone,
    Login as LoginIcon,
    AppRegistration,
    ArrowBack,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { USER_TYPES } from '../utils/constants';
import { userLoginSchema, userRegisterSchema } from '../utils/validationSchemas';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Login = ({ isRegisterMode = false }) => {
    const [isLogin, setIsLogin] = useState(!isRegisterMode);
    const [showPassword, setShowPassword] = useState(false);

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

    const switchMode = (loginMode) => {
        setIsLogin(loginMode);
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
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
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
                        p: 4,
                        borderRadius: 4,
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <img
                                src="/images/styler-logo.png"
                                alt="Styler"
                                style={{ height: 50, width: 'auto' }}
                            />
                        </Box>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {isLogin ? 'Login to book your appointment' : 'Sign up to get started'}
                        </Typography>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={isLogin ? 0 : 1}
                        onChange={(e, newValue) => switchMode(newValue === 0)}
                        variant="fullWidth"
                        sx={{ mb: 4 }}
                    >
                        <Tab
                            label="Login"
                            icon={<LoginIcon />}
                            iconPosition="start"
                            sx={{ fontWeight: 600 }}
                        />
                        <Tab
                            label="Sign Up"
                            icon={<AppRegistration />}
                            iconPosition="start"
                            sx={{ fontWeight: 600 }}
                        />
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
                                <Stack spacing={3}>
                                    {!isLogin && (
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            {...register('name')}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}

                                    <TextField
                                        fullWidth
                                        label="Email Address"
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

                                    {!isLogin && (
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            {...register('phone')}
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Phone />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}

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
                                        }}
                                    >
                                        {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                                    </Button>
                                </Stack>
                            </MotionBox>
                        </AnimatePresence>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            component={Link}
                            to="/"
                            startIcon={<ArrowBack />}
                            sx={{ fontWeight: 600 }}
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
