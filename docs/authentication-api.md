# Authentication API Endpoints

This document describes the authentication endpoints for the Secure Statement Service.

## Base URL
```
http://localhost:3000/api/v1/auth
```

## Authentication Endpoints

### 1. Login Admin User
**POST** `/login`

Authenticate with admin credentials only. No user registration is available - only the pre-created admin user can login.

**Request Body:**
```json
{
  "email": "admin@yourdomain.com",
  "password": "AdminPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "userId": "uuid-string",
  "email": "admin@yourdomain.com",
  "roles": ["admin"],
  "message": "Login successful. Session created."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "AdminPassword123!"
  }'
```

### 2. Logout Admin User
**POST** `/logout`

Logout the currently authenticated admin user and destroy the session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful. Session destroyed."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt
```

### 3. Get Current Admin User
**GET** `/me`

Get information about the currently authenticated admin user.

**Response (200):**
```json
{
  "success": true,
  "userId": "uuid-string",
  "email": "admin@yourdomain.com",
  "roles": ["admin"],
  "emailVerified": true
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Error Responses

### Authentication Required (401)
```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

### Registration Disabled (400)
```json
{
  "statusCode": 400,
  "message": "Registration is disabled. Please contact an administrator for access.",
  "error": "Bad Request"
}
```

### Invalid Credentials (401)
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### User Not Found (404)
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Session Management

- Sessions are managed via HTTP cookies
- Session duration: 7 days (configurable)
- Anti-CSRF tokens are used for session security
- All authentication endpoints use secure cookies in production

## Testing with cURL

To test the complete authentication flow:

1. **Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "AdminPassword123!"
  }'
```

2. **Get User Info:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -b cookies.txt
```

3. **Logout:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Admin-Only System

This system is configured for admin-only access:
- No public user registration is available
- Only the pre-created admin user can login
- Admin user is created automatically during Docker deployment
- Admin credentials are configured via environment variables

For access to the system, contact your system administrator.

## SuperTokens Dashboard

Access the SuperTokens dashboard at:
```
http://localhost:3567/auth/dashboard
```

Use your `SUPERTOKENS_DASHBOARD_API_KEY` to authenticate and manage users directly.