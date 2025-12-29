import 'reflect-metadata';
import { config, validateConfig } from '@config/environment';
import { createApp } from './app';
import { mongoDBService } from '@infrastructure/database/mongodb.service';
import { redisService } from '@infrastructure/cache/redis.service';
import { logger } from '@infrastructure/logger/logger.service';

/**
 * Bootstrap the application
 */
async function bootstrap(): Promise<void> {
    try {
        // Validate environment configuration
        validateConfig();
        logger.info('✅ Environment configuration validated');

        // Connect to MongoDB
        await mongoDBService.connect();
        logger.info('✅ MongoDB connected');

        // Connect to Redis (optional - graceful degradation)
        try {
            await redisService.connect();
            logger.info('✅ Redis connected');
        } catch (error) {
            logger.warn('⚠️  Redis connection failed - caching disabled');
        }

        // Create Express app
        const app = createApp();

        // Start server
        const port = config.server.port;
        app.listen(port, () => {
            logger.info('='.repeat(50));
            logger.info(`🚀 Styler API Server`);
            logger.info(`📍 Environment: ${config.env}`);
            logger.info(`🌐 Server running on port: ${port}`);
            logger.info(`🔗 API URL: http://localhost:${port}`);
            logger.info(`📚 API Documentation: http://localhost:${port}/api-docs`);
            logger.info(`💚 Health Check: http://localhost:${port}/health`);
            logger.info('='.repeat(50));
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    await mongoDBService.disconnect();
    await redisService.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    await mongoDBService.disconnect();
    await redisService.disconnect();
    process.exit(0);
});

// Start the application
bootstrap().catch((error) => {
    logger.error('Bootstrap error:', error);
    process.exit(1);
});
