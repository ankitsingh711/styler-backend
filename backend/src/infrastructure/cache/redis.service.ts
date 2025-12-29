import { createClient, RedisClientType } from 'redis';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { ExternalServiceException } from '@common/exceptions';

/**
 * Redis Cache Service
 * Implements caching operations with Redis
 */
class RedisService {
    private client: RedisClientType | null = null;
    private isConnecting = false;

    /**
     * Connect to Redis
     */
    async connect(): Promise<void> {
        if (this.client?.isReady) {
            logger.info('Redis already connected');
            return;
        }

        if (this.isConnecting) {
            logger.info('Redis connection already in progress');
            return;
        }

        this.isConnecting = true;

        try {
            this.client = createClient({
                socket: {
                    host: config.redis.host,
                    port: config.redis.port,
                },
                password: config.redis.password,
                database: config.redis.db,
            });

            this.client.on('connect', () => {
                logger.info('Redis connecting...');
            });

            this.client.on('ready', () => {
                logger.info('Redis connected and ready');
            });

            this.client.on('error', (error) => {
                logger.error('Redis error:', error);
            });

            this.client.on('end', () => {
                logger.warn('Redis connection closed');
            });

            await this.client.connect();

            // Graceful shutdown
            process.on('SIGINT', () => this.disconnect());
            process.on('SIGTERM', () => this.disconnect());

            this.isConnecting = false;
        } catch (error) {
            this.isConnecting = false;
            logger.error('Failed to connect to Redis:', error);
            // Don't throw error - allow app to work without cache
            this.client = null;
        }
    }

    /**
     * Disconnect from Redis
     */
    async disconnect(): Promise<void> {
        if (!this.client) {
            return;
        }

        try {
            await this.client.quit();
            this.client = null;
            logger.info('Redis disconnected successfully');
        } catch (error) {
            logger.error('Error disconnecting from Redis:', error);
        }
    }

    /**
     * Get value by key
     */
    async get<T = string>(key: string): Promise<T | null> {
        try {
            if (!this.client?.isReady) {
                logger.warn('Redis not available, skipping get operation');
                return null;
            }

            const value = await this.client.get(key);
            if (!value) {
                return null;
            }

            try {
                return JSON.parse(value) as T;
            } catch {
                return value as T;
            }
        } catch (error) {
            logger.error(`Error getting key ${key} from Redis:`, error);
            return null;
        }
    }

    /**
     * Set value with optional TTL
     */
    async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
        try {
            if (!this.client?.isReady) {
                logger.warn('Redis not available, skipping set operation');
                return false;
            }

            const serialized = typeof value === 'string' ? value : JSON.stringify(value);

            if (ttl) {
                await this.client.setEx(key, ttl, serialized);
            } else {
                await this.client.set(key, serialized);
            }

            return true;
        } catch (error) {
            logger.error(`Error setting key ${key} in Redis:`, error);
            return false;
        }
    }

    /**
     * Delete key
     */
    async delete(key: string): Promise<boolean> {
        try {
            if (!this.client?.isReady) {
                return false;
            }

            await this.client.del(key);
            return true;
        } catch (error) {
            logger.error(`Error deleting key ${key} from Redis:`, error);
            return false;
        }
    }

    /**
     * Delete multiple keys
     */
    async deleteMany(keys: string[]): Promise<number> {
        try {
            if (!this.client?.isReady || keys.length === 0) {
                return 0;
            }

            return await this.client.del(keys);
        } catch (error) {
            logger.error('Error deleting multiple keys from Redis:', error);
            return 0;
        }
    }

    /**
     * Delete keys by pattern
     */
    async deleteByPattern(pattern: string): Promise<number> {
        try {
            if (!this.client?.isReady) {
                return 0;
            }

            const keys = await this.client.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }

            return await this.client.del(keys);
        } catch (error) {
            logger.error(`Error deleting keys by pattern ${pattern}:`, error);
            return 0;
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        try {
            if (!this.client?.isReady) {
                return false;
            }

            const exists = await this.client.exists(key);
            return exists === 1;
        } catch (error) {
            logger.error(`Error checking if key ${key} exists:`, error);
            return false;
        }
    }

    /**
     * Set expiration on key
     */
    async expire(key: string, seconds: number): Promise<boolean> {
        try {
            if (!this.client?.isReady) {
                return false;
            }

            return await this.client.expire(key, seconds);
        } catch (error) {
            logger.error(`Error setting expiration on key ${key}:`, error);
            return false;
        }
    }

    /**
     * Get TTL of key
     */
    async ttl(key: string): Promise<number> {
        try {
            if (!this.client?.isReady) {
                return -1;
            }

            return await this.client.ttl(key);
        } catch (error) {
            logger.error(`Error getting TTL for key ${key}:`, error);
            return -1;
        }
    }

    /**
     * Flush all keys in current database
     */
    async flushDb(): Promise<void> {
        try {
            if (!this.client?.isReady) {
                return;
            }

            await this.client.flushDb();
            logger.info('Redis database flushed');
        } catch (error) {
            logger.error('Error flushing Redis database:', error);
        }
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            if (!this.client?.isReady) {
                return false;
            }

            const pong = await this.client.ping();
            return pong === 'PONG';
        } catch (error) {
            logger.error('Redis health check failed:', error);
            return false;
        }
    }

    /**
     * Get client instance (use with caution)
     */
    getClient(): RedisClientType | null {
        return this.client;
    }
}

export const redisService = new RedisService();
