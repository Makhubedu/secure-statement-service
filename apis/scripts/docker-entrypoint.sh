#!/bin/sh
set -e

echo "Creating database if it doesn't exist..."
node scripts/create-database.js

echo "Running database migrations..."
pnpm run migration:run

echo "Starting application..."
exec node dist/src/main
