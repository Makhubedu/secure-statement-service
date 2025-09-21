# Docker Scripts

This directory contains scripts to help manage the Docker environment.

## Available Scripts

### Start Development Environment
```bash
# Start only infrastructure services (DB, MinIO, Redis)
npm run docker:dev

# Or using pnpm
pnpm docker:dev
```

### Start Production Environment
```bash
# Build and start all services including the app
npm run docker:prod

# Or using pnpm
pnpm docker:prod
```

### Stop Services
```bash
# Stop development services
npm run docker:dev:down

# Stop production services
npm run docker:prod:down
```

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Access Services

#### MinIO Console
- URL: http://localhost:9001
- Username: minioadmin
- Password: minioadmin123

#### PostgreSQL
- Host: localhost
- Port: 5432 (production) / 5433 (development)
- Database: secure_statements
- Username: postgres
- Password: password123

#### Application
- URL: http://localhost:3000
- Health Check: http://localhost:3000/health