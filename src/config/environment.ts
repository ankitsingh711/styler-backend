import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Environment configuration with type safety and validation
 */
export const config = {
    /**
     * Environment
     */
    env: process.env.NODE_ENV || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',

    /**
     * Server configuration
     */
    server: {
        port: parseInt(process.env.PORT || '9168', 10),
        apiVersion: process.env.API_VERSION || 'v1',
        clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    },

    /**
     * Database configuration
     */
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/styler',
        testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/styler_test',
        options: {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        },
    },

    /**
     * Redis configuration
     */
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0', 10),
    },

    /**
     * JWT configuration
     */
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-me',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-me',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    /**
     * AWS Configuration
     */
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        s3: {
            bucketName: process.env.S3_BUCKET_NAME || 'styler-uploads',
        },
        ses: {
            region: process.env.SES_REGION || 'us-east-1',
            fromEmail: process.env.SES_FROM_EMAIL || 'noreply@styler.com',
            fromName: process.env.SES_FROM_NAME || 'Styler',
        },
    },

    /**
     * CloudWatch Configuration
     */
    cloudwatch: {
        enabled: process.env.CLOUDWATCH_ENABLED === 'true',
        logGroup: process.env.CLOUDWATCH_LOG_GROUP || `/styler/backend/${process.env.NODE_ENV || 'development'}`,
        logStream: process.env.CLOUDWATCH_LOG_STREAM || `${process.env.HOSTNAME || 'local'}-${Date.now()}`,
        region: process.env.CLOUDWATCH_REGION || process.env.AWS_REGION || 'us-east-1',
    },

    /**
     * Twilio (SMS) Configuration
     */
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },

    /**
     * Razorpay (Payment) Configuration
     */
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },

    /**
     * Google Maps Configuration
     */
    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },

    /**
     * Platform Settings
     */
    platform: {
        commissionPercentage: parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || '15'),
        homeServiceFeePercentage: parseFloat(process.env.HOME_SERVICE_FEE_PERCENTAGE || '20'),
        maxUploadSizeMB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '5', 10),
        otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    },

    /**
     * Rate Limiting
     */
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    /**
     * Logging
     */
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
        file: process.env.LOG_FILE || 'logs/app.log',
    },
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
    const requiredVars: string[] = [];

    if (config.isProduction) {
        requiredVars.push(
            'JWT_ACCESS_SECRET',
            'JWT_REFRESH_SECRET',
            'MONGODB_URI',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'S3_BUCKET_NAME'
        );
    }

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }
}
