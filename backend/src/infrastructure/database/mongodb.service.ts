import mongoose from 'mongoose';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { DatabaseException } from '@common/exceptions';

/**
 * MongoDB Service - Handles database connections and operations
 */
class MongoDBService {
    private connection: typeof mongoose | null = null;
    private isConnecting = false;

    /**
     * Connect to MongoDB
     */
    async connect(): Promise<void> {
        if (this.connection) {
            logger.info('MongoDB already connected');
            return;
        }

        if (this.isConnecting) {
            logger.info('MongoDB connection already in progress');
            return;
        }

        this.isConnecting = true;

        try {
            const uri = config.isTest ? config.database.testUri : config.database.uri;

            this.connection = await mongoose.connect(uri, config.database.options);

            mongoose.connection.on('connected', () => {
                logger.info('MongoDB connected successfully');
            });

            mongoose.connection.on('error', (error) => {
                logger.error('MongoDB connection error:', error);
            });

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
            });

            // Graceful shutdown
            process.on('SIGINT', () => this.disconnect());
            process.on('SIGTERM', () => this.disconnect());

            this.isConnecting = false;
        } catch (error) {
            this.isConnecting = false;
            logger.error('Failed to connect to MongoDB:', error);
            throw new DatabaseException('Failed to connect to database');
        }
    }

    /**
     * Disconnect from MongoDB
     */
    async disconnect(): Promise<void> {
        if (!this.connection) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.connection = null;
            logger.info('MongoDB disconnected successfully');
        } catch (error) {
            logger.error('Error disconnecting from MongoDB:', error);
            throw new DatabaseException('Failed to disconnect from database');
        }
    }

    /**
     * Get connection instance
     */
    getConnection(): typeof mongoose {
        if (!this.connection) {
            throw new DatabaseException('Database not connected');
        }
        return this.connection;
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return mongoose.connection.readyState === 1;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            if (!this.isConnected()) {
                return false;
            }
            await mongoose.connection.db.admin().ping();
            return true;
        } catch (error) {
            logger.error('MongoDB health check failed:', error);
            return false;
        }
    }
}

export const mongoDBService = new MongoDBService();
