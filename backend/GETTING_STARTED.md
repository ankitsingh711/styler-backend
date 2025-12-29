# Styler Backend Refactoring - Getting Started

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MongoDB (local or Atlas)
- Redis (optional but recommended)

## Installation

1. **Install dependencies:**
   ```bash
   cd /Users/ankit/Desktop/Styler/backend
   pnpm install
   ``` 

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your actual credentials:
   - MongoDB connection string
   - Redis configuration (if using)
   - AWS credentials for S3
   - Payment gateway credentials (when implemented)
   - Email/SMS service credentials (when implemented)

3. **Create logs directory:**
   ```bash
   mkdir -p logs
   ```

## Running the Application

### Development Mode
```bash
pnpm dev
```
This uses `ts-node-dev` for hot reloading.

### Production Build
```bash
# Build TypeScript to JavaScript
pnpm build

# Run production server
pnpm start:prod
```

### Testing
```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### Code Quality
```bash
# Lint code
pnpm lint

# Fix linting errors
pnpm lint:fix

# Format code
pnpm format
```

## Project Status

The foundation is complete. See `README.md` for detailed progress.

**Next step:** Implement Phase 3 (Authentication Module)

## Need Help?

- Check `README.md` for progress and next steps
- See `implementation_plan.md` for detailed architecture
- Review `task.md` for task breakdown

## Quick Test

After setup, visit:
- Health Check: http://localhost:9168/health
- API Root: http://localhost:9168/

You should see JSON responses if everything is working!
