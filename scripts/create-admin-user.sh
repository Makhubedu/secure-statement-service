#!/bin/bash

# SuperTokens Admin User Creation Script

set -e

echo "Creating SuperTokens admin user..."

# Wait for SuperTokens to be ready
echo "Waiting for SuperTokens to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://supertokens:3567/hello > /dev/null 2>&1; then
        echo "SuperTokens is ready"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts - waiting 2 seconds..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "SuperTokens failed to become ready after $max_attempts attempts"
    exit 1
fi

sleep 5

echo "Creating admin user: $SUPERTOKENS_ADMIN_EMAIL"

# Wait for the app to be ready
echo "Waiting for NestJS app to be ready..."
app_attempts=60
app_attempt=0

while [ $app_attempt -lt $app_attempts ]; do
    if curl -s http://app:3000/api/v1/health > /dev/null 2>&1; then
        echo "NestJS app is ready"
        break
    fi
    
    app_attempt=$((app_attempt + 1))
    echo "App attempt $app_attempt/$app_attempts - waiting 3 seconds..."
    sleep 3
done

if [ $app_attempt -eq $app_attempts ]; then
    echo "NestJS app failed to become ready - cannot create admin user"
    exit 1
fi

# Create admin user via NestJS app signup endpoint (will work because of our conditional logic)
response=$(curl -s -w "%{http_code}" \
    --location \
    --request POST 'http://app:3000/auth/signup' \
    --header 'Content-Type: application/json' \
    --data-raw "{
        \"formFields\": [
            {
                \"id\": \"email\",
                \"value\": \"$SUPERTOKENS_ADMIN_EMAIL\"
            },
            {
                \"id\": \"password\",
                \"value\": \"$SUPERTOKENS_ADMIN_PASSWORD\"
            }
        ]
    }" \
    --output /tmp/response.json)

http_code="${response: -3}"
response_body=$(cat /tmp/response.json)

echo "HTTP Response Code: $http_code"
echo "Response Body: $response_body"

if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
    echo "Admin user created successfully via NestJS app"
    
    # Extract user ID from response
    user_id=$(echo "$response_body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$user_id" ]; then
        # Try alternative JSON structure
        user_id=$(echo "$response_body" | grep -o '"userId":"[^"]*"' | cut -d'"' -f4)
    fi
    
    if [ -n "$user_id" ]; then
        echo "User created with ID: $user_id"
        
        # Assign admin role using SuperTokens Core API
        echo "Assigning admin role to user: $user_id"
        role_response=$(curl -s -w "%{http_code}" \
            --location \
            --request POST 'http://supertokens:3567/recipe/role/user' \
            --header 'rid: userroles' \
            --header "api-key: $SUPERTOKENS_DASHBOARD_API_KEY" \
            --header 'Content-Type: application/json' \
            --data-raw "{
                \"userId\": \"$user_id\",
                \"role\": \"admin\"
            }" \
            --output /tmp/role_response.json)
        
        role_http_code="${role_response: -3}"
        role_body=$(cat /tmp/role_response.json)
        echo "Role assignment HTTP code: $role_http_code"
        echo "Role assignment response: $role_body"
        
        rm -f /tmp/role_response.json
    else
        echo "Warning: Could not extract user ID from response"
        echo "Full response: $response_body"
    fi
    
    echo "Email: $SUPERTOKENS_ADMIN_EMAIL"
    echo "Login URL: http://localhost:3000/auth/login"
elif [ "$http_code" = "400" ] && echo "$response_body" | grep -q "EMAIL_ALREADY_EXISTS_ERROR"; then
    echo "Admin user already exists - user should be able to login"
    echo "Email: $SUPERTOKENS_ADMIN_EMAIL"
    echo "Login URL: http://localhost:3000/auth/login"
else
    echo "Failed to create admin user"
    echo "HTTP Code: $http_code"
    echo "Response: $response_body"
    exit 1
fi

rm -f /tmp/response.json

echo "Admin user setup completed"