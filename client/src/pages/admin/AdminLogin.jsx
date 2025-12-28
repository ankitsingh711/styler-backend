import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { USER_TYPES } from '../../utils/constants';
import { adminLoginSchema } from '../../utils/validationSchemas';
import './AdminLogin.css';

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

            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid admin credentials';
            showError(errorMessage);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <h1>Admin Login</h1>
                    <p>Access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="email">Admin Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            placeholder="Enter admin email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            placeholder="Enter password"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
