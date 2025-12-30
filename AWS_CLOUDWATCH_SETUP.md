# AWS CloudWatch Setup Guide

Complete guide for setting up and using AWS CloudWatch with the Styler backend application.

## Part 1: AWS Console Setup

### Step 1: Create IAM User with CloudWatch Permissions

1. **Sign in to AWS Console** → Go to **IAM** service

2. **Create User**:
   - Click "Users" → "Create user"
   - User name: `styler-backend-cloudwatch`
   - Click "Next"

3. **Attach Permissions**:
   
   **Option A: AWS Managed Policies (Quick Setup)**
   - Select "Attach policies directly"
   - Search and select:
     - `CloudWatchLogsFullAccess`
     - `CloudWatchFullAccess`
   - Click "Next" → "Create user"

   **Option B: Custom Policy (Recommended for Production - Least Privilege)**
   - Select "Attach policies directly"
   - Click "Create policy"
   - Choose JSON tab and paste:
   
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "CloudWatchLogsAccess",
         "Effect": "Allow",
         "Action": [
           "logs:CreateLogGroup",
           "logs:CreateLogStream",
           "logs:PutLogEvents",
           "logs:DescribeLogStreams",
           "logs:DescribeLogGroups"
         ],
         "Resource": "arn:aws:logs:*:*:log-group:/styler/*"
       },
       {
         "Sid": "CloudWatchMetricsAccess",
         "Effect": "Allow",
         "Action": [
           "cloudwatch:PutMetricData",
           "cloudwatch:GetMetricData",
           "cloudwatch:GetMetricStatistics",
           "cloudwatch:ListMetrics"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   
   - Name: `StylerBackendCloudWatchPolicy`
   - Click "Create policy"
   - Go back to user creation, refresh policies, and select your custom policy
   - Click "Next" → "Create user"

4. **Create Access Keys**:
   - Click on the newly created user
   - Go to "Security credentials" tab
   - Scroll to "Access keys"
   - Click "Create access key"
   - Use case: Select "Application running outside AWS"
   - Click "Next" → "Create access key"
   - **IMPORTANT**: Copy both:
     - Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`)
     - Secret Access Key (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - Store these securely - you won't be able to see the secret again!

---

### Step 2: (Optional) Pre-create Log Groups

CloudWatch Log Groups are automatically created by the application, but you can create them manually for better control:

1. **Go to CloudWatch Console** → "Log groups"

2. **Create Log Group**:
   - Click "Create log group"
   - Log group name: `/styler/backend/production`
   - Retention setting: `7 days` (or your preference)
   - Click "Create"

3. **Repeat for other environments**:
   - `/styler/backend/development`
   - `/styler/backend/staging`

---

### Step 3: Set Up CloudWatch Dashboard

1. **CloudWatch Console** → "Dashboards" → "Create dashboard"

2. **Dashboard name**: `Styler-Backend-Monitoring`

3. **Add Widgets**:

   **Widget 1: API Request Count**
   - Type: Line graph
   - Metrics: Custom → `Styler/Backend` → `APIRequestCount`
   - Dimensions: All
   - Statistic: Sum
   - Period: 5 minutes

   **Widget 2: API Latency**
   - Type: Line graph
   - Metrics: `Styler/Backend` → `APILatency`
   - Dimensions: All
   - Statistics: Average, p99, p50
   - Period: 5 minutes

   **Widget 3: Error Rate**
   - Type: Number
   - Metrics: `Styler/Backend` → `APIErrorCount`
   - Statistic: Sum
   - Period: 1 hour

   **Widget 4: Response Status Distribution**
   - Type: Pie chart
   - Metrics: `Styler/Backend` → `APIResponseStatus`
   - Group by: StatusClass dimension

4. **Save dashboard**

---

### Step 4: Create CloudWatch Alarms

**Alarm 1: High Error Rate**

1. **CloudWatch Console** → "Alarms" → "All alarms" → "Create alarm"

2. **Select metric**:
   - Browse → Metrics → `Styler/Backend`
   - Select `APIErrorCount`
   - Click "Select metric"

3. **Configure alarm**:
   - Statistic: Sum
   - Period: 5 minutes
   - Threshold type: Static
   - Whenever APIErrorCount is: **Greater than 10**
   - Datapoints to alarm: **2 out of 2**

4. **Configure actions**:
   - Alarm state trigger: In alarm
   - Select SNS topic: Create new topic
   - Topic name: `styler-backend-alerts`
   - Email endpoint: your-email@example.com
   - Click "Create topic"

5. **Name and description**:
   - Alarm name: `Styler-Backend-High-Error-Rate`
   - Description: "Triggers when error rate exceeds 10 in 10 minutes"
   - Click "Next" → "Create alarm"

6. **Confirm SNS subscription**: Check your email and confirm the subscription

**Alarm 2: High API Latency**

1. **Create alarm** (same steps as above)
2. **Metric**: `APILatency`
3. **Statistic**: Average
4. **Threshold**: Greater than **3000** (3 seconds)
5. **Datapoints**: 3 out of 3
6. **SNS Topic**: Use same `styler-backend-alerts`
7. **Name**: `Styler-Backend-High-Latency`

---

## Part 2: Application Configuration

### Step 1: Add Environment Variables

Add these to your `.env` file:

```bash
# CloudWatch Configuration
CLOUDWATCH_ENABLED=true
CLOUDWATCH_LOG_GROUP=/styler/backend/production
CLOUDWATCH_LOG_STREAM=production-server-1
CLOUDWATCH_REGION=ap-south-1

# AWS Credentials (if not already set)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Environment-specific configurations**:

**Development** (`.env.development`):
```bash
CLOUDWATCH_ENABLED=true
CLOUDWATCH_LOG_GROUP=/styler/backend/development
CLOUDWATCH_LOG_STREAM=dev-${HOSTNAME}
```

**Production** (`.env.production`):
```bash
CLOUDWATCH_ENABLED=true
CLOUDWATCH_LOG_GROUP=/styler/backend/production
CLOUDWATCH_LOG_STREAM=prod-server-${INSTANCE_ID}
```

---

### Step 2: Start Application

```bash
# Development
pnpm dev

# Production
pnpm start:prod
```

**Expected output**:
```
✅ CloudWatch Logs transport initialized
✅ CloudWatch Metrics initialized
🚀 Server running on port 9168
```

---

### Step 3: Verify Logs in CloudWatch

1. **CloudWatch Console** → "Logs" → "Log groups"

2. **Find your log group**: `/styler/backend/development` or `/styler/backend/production`

3. **Click on the log group** → View log streams

4. **Click on a log stream** → You should see your application logs in JSON format

**Example log entry**:
```json
{
  "level": "info",
  "message": "Server running on port 9168",
  "context": "Server",
  "timestamp": "2025-12-30T14:00:00.000Z"
}
```

---

### Step 4: Verify Metrics in CloudWatch

1. **CloudWatch Console** → "Metrics" → "All metrics"

2. **Find namespace**: `Styler/Backend`

3. **View metrics**:
   - APIRequestCount
   - APILatency
   - APIErrorCount
   - APIResponseStatus

4. **Create graph**: Select a metric and click "Graphed metrics" tab to visualize

**Note**: Metrics may take 1-2 minutes to appear after first API request

---

## Part 3: Using CloudWatch in Your Application

### Automatic Metrics (Already Integrated)

The metrics middleware automatically tracks:
- **APIRequestCount**: Every API request
- **APILatency**: Response time for each endpoint
- **APIErrorCount**: Failed requests (4xx, 5xx)
- **APIResponseStatus**: Distribution of status codes

No code changes needed - it's automatic!

---

### Custom Metrics

You can add custom metrics anywhere in your code:

```typescript
import { cloudwatchMetrics } from '@infrastructure/monitoring/cloudwatch.service';

// Increment a counter
cloudwatchMetrics.incrementCounter('AppointmentBooked', {
  SalonId: 'salon123',
  ServiceType: 'haircut',
});

// Record latency
cloudwatchMetrics.recordLatency('DatabaseQueryTime', 45, {
  Query: 'findAppointments',
});

// Record percentage
cloudwatchMetrics.recordPercentage('CacheHitRate', 85.5);

// Record bytes
cloudwatchMetrics.recordBytes('ImageUploadSize', 2048000);
```

---

### Custom Logs

Logging is automatic, but you can add context:

```typescript
import { createLogger } from '@infrastructure/logger/logger.service';

const logger = createLogger('PaymentService');

logger.info('Payment initiated', {
  orderId: 'order123',
  amount: 1500,
  method: 'upi',
});

logger.error('Payment failed', new Error('Gateway timeout'));
```

All logs automatically go to CloudWatch (if enabled).

---

## Part 4: CloudWatch Logs Insights Queries

Use these queries to analyze your logs:

### Query 1: Error Rate by Hour
```
fields @timestamp, message, level
| filter level = "error"
| stats count() as errorCount by bin(@timestamp, 1h)
```

### Query 2: Slowest API Endpoints
```
fields @timestamp, context, message, meta.Route, meta.StatusCode
| filter message = "API request"
| sort meta.duration desc
| limit 20
```

### Query 3: User Activity
```
fields @timestamp, message, meta.userId
| filter meta.userId like /user/
| stats count() as requestCount by meta.userId
| sort requestCount desc
```

### Query 4: Error Messages
```
fields @timestamp, message, meta.error.message, meta.error.stack
| filter level = "error"
| sort @timestamp desc
| limit 50
```

---

## Part 5: Cost Optimization

### Free Tier Limits
- **CloudWatch Logs**: First 5GB ingested per month FREE
- **CloudWatch Metrics**: First 10 custom metrics FREE
- **API Requests**: 1 million requests per month FREE

### Estimated Costs (after free tier)
- **Logs ingestion**: $0.50 per GB
- **Logs storage**: $0.03 per GB/month
- **Custom metrics**: $0.30 per metric/month
- **Dashboard**: $3 per month

### Tips to Reduce Costs
1. **Set log retention**: Use 7 days for dev, 30-90 days for production
2. **Filter noisy logs**: Don't log every debug statement in production
3. **Use log sampling**: Log 10% of successful requests, 100% of errors
4. **Clean up old log groups**: Delete unused log groups

---

## Part 6: Troubleshooting

### Issue: Logs not appearing in CloudWatch

**Check 1**: Verify credentials
```bash
# Test AWS credentials
aws sts get-caller-identity
```

**Check 2**: Verify IAM permissions
- Ensure user has `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

**Check 3**: Check application logs
```bash
tail -f logs/combined.log
```
Look for "CloudWatch Logs transport initialized"

**Check 4**: Verify environment variables
```bash
echo $CLOUDWATCH_ENABLED
echo $AWS_ACCESS_KEY_ID
```

---

### Issue: Metrics not showing

**Wait**: Metrics can take 1-2 minutes to appear after first request

**Verify**: Make API requests to generate metrics
```bash
curl http://localhost:9168/api/v1/auth/login
```

**Check**: CloudWatch Console → Metrics → Custom Namespaces → `Styler/Backend`

---

### Issue: High costs

**Review**: CloudWatch Console → Billing → CloudWatch usage

**Actions**:
- Reduce log retention period
- Disable CloudWatch in development: `CLOUDWATCH_ENABLED=false`
- Use sampling for high-volume logs

---

## Part 7: Production Best Practices

1. **Use IAM Roles** (if running on EC2/ECS):
   - Don't use access keys
   - Attach IAM role to instance with CloudWatch permissions

2. **Encrypt Logs**:
   - CloudWatch Console → Log group → Actions → Edit
   - Enable encryption with KMS key

3. **Set Alarms**:
   - High error rate
   - High latency
   - Low disk space (if applicable)

4. **Regular Monitoring**:
   - Review dashboards daily
   - Set up SNS alerts to email/Slack
   - Use CloudWatch Insights for deep analysis

5. **Tag Resources**:
   - Add tags to log groups: Environment, Application, Team

---

## Summary

You've now set up:
- ✅ IAM user with CloudWatch permissions
- ✅ CloudWatch Log Groups for centralized logging
- ✅ CloudWatch Metrics for application monitoring
- ✅ CloudWatch Dashboards for visualization
- ✅ CloudWatch Alarms for proactive alerts

Your application now automatically:
- 📊 Sends logs to CloudWatch Logs
- 📈 Tracks API metrics (requests, latency, errors)
- 🔔 Alerts you when errors spike or latency is high

**Next Steps**:
1. Make some API requests to generate metrics
2. View logs in CloudWatch Console
3. Create custom metrics for business KPIs
4. Set up more alarms as needed

**Cost Estimate**: $2-10/month for moderate usage

---

**Happy Monitoring! 🚀**
