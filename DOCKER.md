# Docker Setup Guide for Styler Backend

This guide covers how to run the Styler backend using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Your `.env` file with required credentials (Razorpay, AWS, etc.)

## Quick Start (Development)

### 1. Start all services with MongoDB UI

```bash
pnpm docker:dev
```

This starts:
- **Backend** - Node.js application on `http://localhost:9168`
- **MongoDB** - Database on `localhost:27017`
- **Redis** - Cache on `localhost:6379`
- **Mongo Express** - Database UI on `http://localhost:8081`

### 2. Access the services

- **API**: http://localhost:9168/api/v1
- **Mongo Express UI**: http://localhost:8081 (username: `admin`, password: `admin`)

### 3. View logs

```bash
pnpm docker:logs
```

### 4. Stop services

```bash
pnpm docker:down
```

---

## Available Docker Commands

All commands are available as npm scripts:

| Command | Description |
|---------|-------------|
| `pnpm docker:dev` | Start dev environment with Mongo Express UI |
| `pnpm docker:dev:build` | Rebuild and start dev environment |
| `pnpm docker:down` | Stop all containers |
| `pnpm docker:clean` | Stop containers and remove volumes |
| `pnpm docker:logs` | View backend logs (follow mode) |
| `pnpm docker:restart` | Restart backend container |
| `pnpm docker:build` | Build production image |
| `pnpm docker:build:dev` | Build development image |

---

## Environment Variables

The docker-compose file reads environment variables from your `.env` file. Make sure you have:

```bash
# Required for Docker setup
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

For Docker-specific configuration, you can create a `.env.docker` file (see `.env.docker.example`).

---

## Development Workflow

### Hot Reload

The development setup mounts your `src/` directory as a volume. Any changes you make will automatically reload the backend:

1. Edit any file in `src/`
2. Save the file
3. Watch the logs: `pnpm docker:logs`
4. Backend automatically restarts

### Accessing MongoDB

**Option 1: Mongo Express UI**
- Visit http://localhost:8081
- Login with username `admin`, password `admin`

**Option 2: MongoDB Compass**
- Connection string: `mongodb://admin:admin123@localhost:27017/styler?authSource=admin`

**Option 3: Command line**
```bash
docker-compose exec mongodb mongosh styler -u admin -p admin123 --authenticationDatabase admin
```

### Accessing Redis

**Redis CLI in container:**
```bash
docker-compose exec redis redis-cli
```

**From host machine:**
```bash
redis-cli -h localhost -p 6379
```

---

## Production Deployment

### Build production image

```bash
pnpm docker:build
```

This creates an optimized image:
- Multi-stage build (smaller size)
- Only production dependencies
- Runs as non-root user
- Includes health checks

### Run production container

```bash
docker run -d \
  --name styler-backend \
  -p 9168:9168 \
  --env-file .env \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-production-mongodb-uri \
  -e REDIS_HOST=your-redis-host \
  styler-backend:latest
```

**Important for production:**
- Use MongoDB Atlas or managed MongoDB (not Docker container)
- Use managed Redis (ElastiCache, Redis Cloud, etc.)
- Set secure environment variables
- Use reverse proxy (nginx) for SSL/TLS
- Enable logging and monitoring

---

## Docker Compose Services

### Backend Service
- **Image**: Built from Dockerfile.dev
- **Port**: 9168
- **Volumes**: Source code mounted for hot reload
- **Depends on**: MongoDB, Redis

### MongoDB Service
- **Image**: mongo:7.0
- **Port**: 27017
- **Credentials**: admin/admin123 (development only!)
- **Volumes**: `mongodb_data` for persistence

### Redis Service
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volumes**: `redis_data` for persistence

### Mongo Express Service (Development Only)
- **Image**: mongo-express:latest
- **Port**: 8081
- **Profile**: dev (only runs with `--profile dev`)

---

## Troubleshooting

### Backend can't connect to MongoDB

**Error:** `Failed to connect to MongoDB`

**Solution:**
1. Check if MongoDB is running: `docker-compose ps`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Verify connection string in docker-compose.yml
4. Ensure MongoDB health check passes: `docker-compose ps mongodb`

### Port already in use

**Error:** `port is already allocated`

**Solution:**
1. Stop existing services: `pnpm dev` or other processes on port 9168
2. Change port in docker-compose.yml if needed: `"8080:9168"`

### Permission denied errors

**Error:** `EACCES: permission denied`

**Solution:**
1. The production Dockerfile runs as non-root user
2. Ensure volumes have correct permissions
3. For development, this shouldn't be an issue

### Container keeps restarting

**Solution:**
1. Check logs: `pnpm docker:logs`
2. Look for errors in startup
3. Verify all required environment variables are set
4. Check if MongoDB/Redis are healthy: `docker-compose ps`

### Hot reload not working

**Solution:**
1. Ensure you're using `Dockerfile.dev` (not production Dockerfile)
2. Check if volume is mounted: `docker-compose config | grep volumes`
3. Verify `ts-node-dev` is running: `pnpm docker:logs`

### Clean slate restart

To completely reset everything:
```bash
pnpm docker:clean  # Removes volumes (deletes all data!)
pnpm docker:dev:build  # Rebuild and start fresh
```

---

## Data Persistence

### Volumes

Docker volumes ensure data persists across container restarts:

- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis data

### Backup MongoDB data

```bash
# Export database
docker-compose exec mongodb mongodump -u admin -p admin123 --authenticationDatabase admin --out=/tmp/backup

# Copy to host
docker cp styler-mongodb:/tmp/backup ./mongodb-backup
```

### Restore MongoDB data

```bash
# Copy backup to container
docker cp ./mongodb-backup styler-mongodb:/tmp/restore

# Import
docker-compose exec mongodb mongorestore -u admin -p admin123 --authenticationDatabase admin /tmp/restore
```

---

## Health Checks

All services include health checks:

**Backend:**
- Checks `/api/v1/health` endpoint every 30s
- 40s startup grace period

**MongoDB:**
- Pings database every 10s

**Redis:**
- PING command every 10s

View health status:
```bash
docker-compose ps
```

---

## Networking

All services run on the `styler-network` bridge network, allowing them to communicate using service names:

- Backend connects to MongoDB at `mongodb:27017`
- Backend connects to Redis at `redis:6379`

---

## Security Notes

### Development
- Default credentials are **NOT secure**
- MongoDB and Redis exposed on host ports (convenient but less secure)
- Mongo Express UI exposed (development only)

### Production
- **Change all default passwords**
- Use secrets management (Docker secrets, AWS Secrets Manager)
- Don't expose MongoDB/Redis ports publicly
- Run behind reverse proxy (nginx)
- Enable authentication on all services
- Use TLS/SSL certificates
- Regular security updates: `docker-compose pull`

---

## Integration with ngrok

If you're using ngrok for webhooks (Razorpay), it works the same:

```bash
# Backend runs on port 9168 regardless of Docker or not
ngrok http 9168
```

Use the ngrok URL in your Razorpay webhook configuration.

---

## Next Steps

1. ✅ Start development environment: `pnpm docker:dev`
2. ✅ Verify all services are running: `docker-compose ps`
3. ✅ Test API: `curl http://localhost:9168/api/v1/auth/login`
4. ✅ Access Mongo Express: http://localhost:8081
5. ✅ Make code changes and watch hot reload
6. 🚀 Build and deploy production image when ready

---

## Useful Docker Commands

```bash
# View all running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs for all services
docker-compose logs -f

# Execute command in container
docker-compose exec backend sh

# Rebuild specific service
docker-compose up -d --build backend

# View resource usage
docker stats

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View volumes
docker volume ls

# Inspect volume
docker volume inspect styler-backend_mongodb_data
```

---

**Happy coding! 🚀**
