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

3. **Update environment variables in `.env` as needed for your environment**

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
curl http://localhost:3000/api/v1/health
```

## 🌐 Access Points

After deployment, the following services are available:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Application** | http://localhost:3000 | N/A |
| **API Documentation** | http://localhost:3000/api/docs | N/A |
| **SuperTokens Dashboard** | http://localhost:3000/auth/dashboard | See dashboard admin emails in .env |
| **MinIO Console** | http://localhost:9003 | minioadmin / minioadmin123 |

## 🔐 Admin Authentication

The admin user is created automatically during startup. Default credentials:
- **Email**: `admin@yourdomain.com`
- **Password**: `AdminPassword123!`

## 📮 API Testing with Postman

### Quick Setup
1. **Import Collection**: Import `postman/Secure-Statement-Service.postman_collection.json`
2. **Import Environment**: Import `postman/Secure-Statement-Service-Local.postman_environment.json`
3. **Select Environment**: Choose "Secure Statement Service - Local"
4. **Login**: Run "Authentication > Login (Sign In)" - tokens are automatically saved
5. **Test Endpoints**: All other endpoints will use saved authentication automatically

### Key Features
- ✅ **Automatic token management** - No manual copying required
- ✅ **Complete API coverage** - All endpoints included
- ✅ **Environment variables** - Easy configuration
- ✅ **Test scripts** - Automatic response validation

## 🔧 Dashboard Access

### SuperTokens Dashboard
- **URL**: http://localhost:3567/auth/dashboard
- **Purpose**: Manage users, view session data, and configure authentication
- **Access**: Use admin emails configured in `SUPERTOKENS_DASHBOARD_ADMINS`

### MinIO Console
- **URL**: http://localhost:9003
- **Purpose**: Manage file storage, view buckets, and monitor uploads
- **Credentials**: `minioadmin` / `minioadmin123` (configurable via `.env`)
- **Features**: 
  - View uploaded statements
  - Monitor storage usage
  - Manage bucket policies
  - Download/preview files

## 📚 API Endpoints

All endpoints are documented with Swagger at http://localhost:3000/api/docs

### Authentication
- **POST** `/auth/signin` - Admin login
- **POST** `/auth/logout` - Admin logout  
- **GET** `/auth/me` - Get current admin user

### Statements (Admin Only - Requires Authentication)
- **POST** `/api/v1/statements/upload` - Upload new PDF statement
- **POST** `/api/v1/statements/download` - Generate secure download link
- **GET** `/api/v1/statements/user/:userId` - Get statements by user ID
- **GET** `/api/v1/statements/:id` - Get statement details
- **GET** `/api/v1/statements/:id/download-logs` - Get download audit logs

### Health Check
- **GET** `/api/v1/health` - Service health status
- **GET** `/api/v1/health/ready` - Service readiness check
- **GET** `/api/v1/health/live` - Service liveness check

**Note:** Use the Postman collection for easy API testing with automatic authentication.

## 🗂️ Services

The application runs with the following Docker services:

| Service | Port | Description |
|---------|------|-------------|
| `app` | 3000 | NestJS application |
| `postgres` | 5432 | PostgreSQL database (main app) |
| `supertokens-db` | 5433 | PostgreSQL database (SuperTokens) |
| `minio` | 9002, 9003 | S3-compatible object storage (API, Console) |
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
curl http://localhost:3000/api/v1/health

# Service readiness
curl http://localhost:3000/api/v1/health/ready

# Service liveness
curl http://localhost:3000/api/v1/health/live
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

- **Change Default Passwords**: Update admin credentials in `.env` before production use
- **Dashboard Security**: Update `SUPERTOKENS_DASHBOARD_API_KEY` and admin emails
- **Database Security**: Use strong credentials for PostgreSQL databases
- **Storage Security**: Change MinIO credentials for production environments
- **JWT Security**: Update `JWT_SECRET` and `ENCRYPTION_KEY` with strong random values
- **Network Security**: Use HTTPS and proper firewall rules in production
- **Environment Variables**: Never commit `.env` files to version control
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
