import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { AppException } from '@common/exceptions';
import { HttpStatus } from '@common/constants';
import { authRoutes } from '@modules/auth/routes/auth.routes';
import { salonRoutes } from '@modules/salons/routes/salon.routes';
import { appointmentRoutes } from '@modules/appointments/routes/appointment.routes';
import { paymentRoutes } from '@modules/payments/routes/payment.routes';
import { reviewRoutes } from '@modules/reviews/routes/review.routes';
import { barberRoutes } from '@modules/barbers/routes/barber.routes';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(
        cors({
            origin: config.server.clientUrl,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    app.use(compression());

    // Request logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    });

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            environment: config.env,
        });
    });

    // Root endpoint
    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'Styler API Server',
            version: '2.0.0',
            documentation: '/api-docs',
        });
    });

    // API Routes
    const apiVersion = config.server.apiVersion;
    app.use(`/api/${apiVersion}/auth`, authRoutes);
    app.use(`/api/${apiVersion}/salons`, salonRoutes);
    app.use(`/api/${apiVersion}/appointments`, appointmentRoutes);
    app.use(`/api/${apiVersion}/payments`, paymentRoutes);
    app.use(`/api/${apiVersion}/reviews`, reviewRoutes);
    app.use(`/api/${apiVersion}/barbers`, barberRoutes);

    // 404 handler
    app.use((req: Request, res: Response) => {
        res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: 'API endpoint not found',
                path: req.path,
            },
        });
    });

    // Global error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        // Log error
        logger.error('Unhandled error:', err);

        // Handle known application exceptions
        if (err instanceof AppException) {
            return res.status(err.statusCode).json(err.toJSON());
        }

        // Handle unknown errors
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: config.isProduction
                    ? 'An unexpected error occurred'
                    : err.message || 'Internal server error',
                ...(config.isDevelopment && { stack: err.stack }),
            },
        });
    });

    return app;
}
