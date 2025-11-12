# Secure Statement Service

A secure platform for managing and distributing financial statements with encryption and audit logging.

## Project Structure

```
secure-statement-service/
├── apis/          # Backend API (NestJS)
└── dashboard/     # Frontend Dashboard (Next.js)
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

## Getting Started

### Backend (APIs)

1. Navigate to the backend directory:
   ```bash
   cd apis
   ```

2. Start the backend with Docker Compose:
   ```bash
   docker-compose up
   ```

   This will start:
   - PostgreSQL database
   - Backend API server
   - All required services

3. The API will be available at: `http://localhost:3000`

### Frontend (Dashboard)

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The dashboard will be available at: `http://localhost:3001`

## Environment Variables

### Backend (apis/.env)
- Database connection settings
- SuperTokens configuration
- Storage configuration

### Frontend (dashboard/.env)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WEBSITE_URL` - Frontend URL

## Default Ports

- Backend API: `3000`
- Frontend Dashboard: `3001`
- PostgreSQL: `5432`

## Additional Commands

### Backend
```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

### Frontend
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Features

- Secure statement upload and management
- Encrypted file storage
- Time-limited download links
- Comprehensive audit logging
- Role-based access control
- Admin dashboard
