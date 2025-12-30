import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import path from 'path';
import { config } from '@config/environment';

/**
 * Logger Service using Winston
 */
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};

winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let logMessage = `${timestamp} [${level}]: ${message}`;

        if (Object.keys(meta).length > 0) {
            logMessage += `\n${JSON.stringify(meta, null, 2)}`;
        }

        return logMessage;
    })
);

// Custom format for file output
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
const transports: winston.transport[] = [
    // Console transport
    new winston.transports.Console({
        format: consoleFormat,
    }),

    // File transport for errors
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),

    // File transport for all logs
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// Add CloudWatch transport if enabled
if (config.cloudwatch?.enabled && config.aws.accessKeyId) {
    try {
        transports.push(
            new WinstonCloudWatch({
                logGroupName: config.cloudwatch.logGroup,
                logStreamName: config.cloudwatch.logStream,
                awsRegion: config.cloudwatch.region,
                awsAccessKeyId: config.aws.accessKeyId,
                awsSecretKey: config.aws.secretAccessKey,
                messageFormatter: ({ level, message, ...meta }) => {
                    return JSON.stringify({
                        level,
                        message,
                        ...meta,
                        timestamp: new Date().toISOString(),
                    });
                },
                retentionInDays: 7,
                uploadRate: 2000, // Send logs every 2 seconds
                errorHandler: (error) => {
                    console.error('CloudWatch logging error:', error);
                },
            })
        );
        console.log('✅ CloudWatch Logs transport initialized');
    } catch (error) {
        console.error('❌ Failed to initialize CloudWatch transport:', error);
    }
}

export const logger = winston.createLogger({
    levels: logLevels,
    level: config.logging.level,
    transports,
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'rejections.log'),
        }),
    ],
});


// Don't log to files in test environment
if (config.isTest) {
    logger.clear();
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

/**
 * Structured logger interface
 */
export class Logger {
    constructor(private readonly context: string) { }

    error(message: string, error?: Error | unknown): void {
        if (error instanceof Error) {
            logger.error(message, {
                context: this.context,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                },
            });
        } else {
            logger.error(message, { context: this.context, error });
        }
    }

    warn(message: string, meta?: unknown): void {
        logger.warn(message, { context: this.context, ...meta });
    }

    info(message: string, meta?: unknown): void {
        logger.info(message, { context: this.context, ...meta });
    }

    debug(message: string, meta?: unknown): void {
        logger.debug(message, { context: this.context, ...meta });
    }

    log(level: string, message: string, meta?: unknown): void {
        logger.log(level, message, { context: this.context, ...meta });
    }
}

/**
 * Create logger instance for a specific context
 */
export function createLogger(context: string): Logger {
    return new Logger(context);
}
