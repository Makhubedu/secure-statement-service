#!/bin/bash
set -e

# This script creates the database if it doesn't exist
# It's intended to be run from the host machine or inside Docker

PGPASSWORD=${DB_PASSWORD:-password123} psql -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE:-secure_statements}'" | grep -q 1 || \
PGPASSWORD=${DB_PASSWORD:-password123} psql -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -c "CREATE DATABASE ${DB_DATABASE:-secure_statements};"

echo "Database ${DB_DATABASE:-secure_statements} is ready"
