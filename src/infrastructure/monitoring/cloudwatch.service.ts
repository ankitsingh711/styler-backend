import { CloudWatchClient, PutMetricDataCommand, StandardUnit } from '@aws-sdk/client-cloudwatch';
import { config } from '@config/environment';
import { createLogger } from '@infrastructure/logger/logger.service';

const logger = createLogger('CloudWatchService');

/**
 * CloudWatch Metrics Service
 * Send custom metrics to AWS CloudWatch
 */
export class CloudWatchMetricsService {
    private client: CloudWatchClient;
    private namespace = 'Styler/Backend';
    private enabled: boolean;

    constructor() {
        this.enabled = config.cloudwatch?.enabled || false;

        if (this.enabled) {
            this.client = new CloudWatchClient({
                region: config.aws.region,
                credentials: {
                    accessKeyId: config.aws.accessKeyId,
                    secretAccessKey: config.aws.secretAccessKey,
                },
            });
            logger.info('CloudWatch Metrics initialized');
        } else {
            logger.info('CloudWatch Metrics disabled');
        }
    }

    /**
     * Send a custom metric to CloudWatch
     */
    async putMetric(
        metricName: string,
        value: number,
        unit: StandardUnit = StandardUnit.None,
        dimensions?: Record<string, string>
    ): Promise<void> {
        if (!this.enabled) return;

        try {
            const metricDimensions = [
                { Name: 'Environment', Value: config.nodeEnv },
                { Name: 'Service', Value: 'backend' },
            ];

            // Add custom dimensions
            if (dimensions) {
                Object.entries(dimensions).forEach(([key, value]) => {
                    metricDimensions.push({ Name: key, Value: value });
                });
            }

            const command = new PutMetricDataCommand({
                Namespace: this.namespace,
                MetricData: [
                    {
                        MetricName: metricName,
                        Value: value,
                        Unit: unit,
                        Timestamp: new Date(),
                        Dimensions: metricDimensions,
                    },
                ],
            });

            await this.client.send(command);
        } catch (error) {
            logger.error('Failed to send metric to CloudWatch', error);
        }
    }

    /**
     * Increment a counter metric
     */
    async incrementCounter(metricName: string, dimensions?: Record<string, string>): Promise<void> {
        await this.putMetric(metricName, 1, StandardUnit.Count, dimensions);
    }

    /**
     * Record latency/duration in milliseconds
     */
    async recordLatency(metricName: string, milliseconds: number, dimensions?: Record<string, string>): Promise<void> {
        await this.putMetric(metricName, milliseconds, StandardUnit.Milliseconds, dimensions);
    }

    /**
     * Record a percentage value
     */
    async recordPercentage(metricName: string, percentage: number, dimensions?: Record<string, string>): Promise<void> {
        await this.putMetric(metricName, percentage, StandardUnit.Percent, dimensions);
    }

    /**
     * Record bytes transferred
     */
    async recordBytes(metricName: string, bytes: number, dimensions?: Record<string, string>): Promise<void> {
        await this.putMetric(metricName, bytes, StandardUnit.Bytes, dimensions);
    }
}

// Singleton instance
export const cloudwatchMetrics = new CloudWatchMetricsService();
