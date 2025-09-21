# Secure Statement Service

A secure PDF statement delivery system built with NestJS, featuring admin-only authentication and role-based access control.

## 🏗️ Architecture

This service provides a secure platform for delivering PDF statements with the following key features:

- **Admin-Only Access**: No public registration - only administrators can access the system
- **Statement Management**: Upload, organize, and deliver PDF statements securely
- **Download Tracking**: Comprehensive audit logging of all statement downloads
- **Secure Storage**: MinIO S3-compatible storage with temporary signed URLs (5-minute expiry)
- **Authentication**: SuperTokens-based authentication with session management
- **Database**: PostgreSQL with TypeORM for data persistence

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Docker Deployment

1. **Clone the repository:**
```bash
git clone https://github.com/Makhubedu/secure-statement-service.git
cd secure-statement-service
```

2. **Copy environment configuration:**
```bash
cp .env.dev .env
```

3. **Update environment variables in `.env`:**
```bash
# Database Configuration
DATABASE_URL=postgresql://admin:password@postgres:5432/secure_statements

# MinIO Storage Configuration  
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=statements
MINIO_USE_SSL=false

# SuperTokens Authentication
SUPERTOKENS_CORE_URI=http://supertokens:3567
SUPERTOKENS_DASHBOARD_API_KEY=your-dashboard-api-key-here

# Admin User (Created automatically on startup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=AdminPassword123!

# Application Settings
PORT=3000
NODE_ENV=production
```

4. **Start all services:**
```bash
docker-compose up -d
```

5. **Verify deployment:**
```bash
# Check all containers are running
docker-compose ps

# View application logs
docker-compose logs app

# Test the application
curl http://localhost:3000/health
```

6. **Access the application:**
- **Main Application**: http://localhost:3000
- **SuperTokens Dashboard**: http://localhost:3567/auth/dashboard
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin123)

## 🔐 Admin Login

The admin user is created automatically during startup. Login with:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "AdminPassword123!"
  }'
```

## 📚 API Endpoints

### Authentication
- **POST** `/api/v1/auth/login` - Admin login
- **POST** `/api/v1/auth/logout` - Admin logout  
- **GET** `/api/v1/auth/me` - Get current admin user

### Statements (Admin Only - Requires Authentication)
- **POST** `/api/v1/statements/upload` - Upload new PDF statement
- **POST** `/api/v1/statements/download` - Generate secure download link
- **GET** `/api/v1/statements/user/:userId` - Get statements by user ID
- **GET** `/api/v1/statements/:id` - Get statement details
- **GET** `/api/v1/statements/:id/download-logs` - Get download audit logs

### Health Check
- **GET** `/health` - Service health status

**Note:** All statement endpoints require admin authentication. Include session cookies from login in your requests.

## 🗂️ Services

The application runs with the following Docker services:

| Service | Port | Description |
|---------|------|-------------|
| `app` | 3000 | NestJS application |
| `postgres` | 5432 | PostgreSQL database |
| `minio` | 9000, 9001 | S3-compatible object storage |
| `supertokens` | 3567 | Authentication service |

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f minio
docker-compose logs -f supertokens
```

### Health Checks
```bash
# Application health
curl http://localhost:3000/health

# Service readiness
curl http://localhost:3000/health/ready

# Service liveness
curl http://localhost:3000/health/live
```

## �️ Management

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Update Services
```bash
docker-compose pull
docker-compose up -d
```

### Clean Up
```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## 🔒 Security Notes

- **Change Default Passwords**: Update `ADMIN_PASSWORD` and `SUPERTOKENS_DASHBOARD_API_KEY` before production use
- **Database Security**: Consider using stronger database credentials for production
- **Storage Security**: MinIO credentials should be changed for production environments
- **Network Security**: Use HTTPS and proper firewall rules in production
- **Backup Strategy**: Implement regular database and file backups

## � Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker is running
docker --version

# Check for port conflicts
docker-compose ps
```

**Database connection errors:**
```bash
# Check database logs
docker-compose logs postgres

# Restart database service
docker-compose restart postgres
```

**Storage issues:**
```bash
# Check MinIO logs
docker-compose logs minio

# Verify bucket creation
docker-compose logs app | grep -i bucket
```

**Authentication issues:**
```bash
# Check SuperTokens logs
docker-compose logs supertokens

# Verify admin user creation
docker-compose logs app | grep -i admin
```

## 📄 License

This project is licensed under the MIT License.
