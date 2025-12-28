import * as yup from 'yup';

// Admin Login Validation Schema
export const adminLoginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .trim(),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
});

// User Login Validation Schema
export const userLoginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .trim(),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
});

// User Registration Validation Schema
export const userRegisterSchema = yup.object().shape({
    name: yup
        .string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .trim(),
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .trim(),
    phone: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        .trim(),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
});
