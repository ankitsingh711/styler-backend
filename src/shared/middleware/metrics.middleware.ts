import { Request, Response, NextFunction } from 'express';
import { cloudwatchMetrics } from '@infrastructure/monitoring/cloudwatch.service';

/**
 * Metrics Middleware
 * Automatically track HTTP request metrics
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Track request count
    cloudwatchMetrics.incrementCounter('APIRequestCount', {
        Method: req.method,
        Route: req.route?.path || req.path,
    });

    // Track response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;

        // Track latency
        cloudwatchMetrics.recordLatency('APILatency', duration, {
            Method: req.method,
            Route: req.route?.path || req.path,
            StatusCode: res.statusCode.toString(),
        });

        // Track status code distribution
        cloudwatchMetrics.incrementCounter('APIResponseStatus', {
            StatusCode: res.statusCode.toString(),
            StatusClass: `${Math.floor(res.statusCode / 100)}xx`,
        });

        // Track errors specifically
        if (res.statusCode >= 400) {
            cloudwatchMetrics.incrementCounter('APIErrorCount', {
                StatusCode: res.statusCode.toString(),
                Route: req.route?.path || req.path,
            });
        }
    });

    next();
};
