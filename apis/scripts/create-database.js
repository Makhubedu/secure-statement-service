const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
const localEnvPath = path.resolve(__dirname, '..', '.env.local');
const defaultEnvPath = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(localEnvPath)) {
  console.log('Loading environment from .env.local');
  dotenv.config({ path: localEnvPath });
} else {
  console.log('Loading environment from .env');
  dotenv.config({ path: defaultEnvPath });
}

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbUser = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'password123';
const dbName = process.env.DB_DATABASE || 'secure_statements';

console.log(`Attempting to create database "${dbName}" on ${dbHost}:${dbPort}...`);

// Check if psql is available
try {
  execSync('psql --version', { stdio: 'ignore' });
} catch (error) {
  console.warn('⚠ psql command not found. Skipping database creation check.');
  console.warn('  Make sure the database exists or create it manually.');
  process.exit(0);
}

try {
  // Check if database exists
  const checkCmd = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -tc "SELECT 1 FROM pg_database WHERE datname = '${dbName}'"`;
  
  const result = execSync(checkCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  
  if (result.trim() === '1') {
    console.log(`✓ Database "${dbName}" already exists`);
  } else {
    // Create database
    const createCmd = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "CREATE DATABASE ${dbName};"`;
    execSync(createCmd, { stdio: 'inherit' });
    console.log(`✓ Database "${dbName}" created successfully`);
  }
} catch (error) {
  console.error('Error creating database:', error.message);
  process.exit(1);
}
