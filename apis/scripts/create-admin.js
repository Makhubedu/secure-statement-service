const supertokens = require('supertokens-node');
const EmailPassword = require('supertokens-node/recipe/emailpassword');
const Session = require('supertokens-node/recipe/session');
const UserRoles = require('supertokens-node/recipe/userroles');

// Get configuration from environment variables
const SUPERTOKENS_CONNECTION_URI = process.env.SUPERTOKENS_CONNECTION_URI || 'http://supertokens:3567';
const SUPERTOKENS_API_KEY = process.env.SUPERTOKENS_API_KEY;
const ADMIN_EMAIL = process.env.SUPERTOKENS_ADMIN_EMAIL || 'admin@yourdomain.com';
const ADMIN_PASSWORD = process.env.SUPERTOKENS_ADMIN_PASSWORD || 'AdminPassword123!';

console.log('Starting admin user creation...');
console.log('SuperTokens URI:', SUPERTOKENS_CONNECTION_URI);
console.log('Admin Email:', ADMIN_EMAIL);

// Initialize SuperTokens
supertokens.init({
  appInfo: {
    appName: "Secure Statement Service",
    apiDomain: "http://localhost:3000",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  supertokens: {
    connectionURI: SUPERTOKENS_CONNECTION_URI,
    apiKey: SUPERTOKENS_API_KEY,
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
    UserRoles.init(),
  ],
});

async function waitForSuperTokens() {
  const maxAttempts = 30;
  const delay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Try to make a simple request to SuperTokens
      await new Promise((resolve, reject) => {
        const http = require('http');
        const url = new URL(SUPERTOKENS_CONNECTION_URI + '/hello');
        const req = http.get({
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          timeout: 5000
        }, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      
      console.log('SuperTokens is ready!');
      return true;
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxAttempts} - SuperTokens not ready: ${error.message}`);
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error('SuperTokens failed to become ready');
}

async function createAdminUser() {
  try {
    // Wait for SuperTokens to be ready
    await waitForSuperTokens();
    
    // Add a small delay to ensure everything is initialized
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Creating admin user:', ADMIN_EMAIL);
    
    // First, create the admin role if it doesn't exist
    console.log('Creating admin role...');
    const createRoleResponse = await UserRoles.createNewRoleOrAddPermissions("admin", []);
    console.log('Admin role creation status:', createRoleResponse.status);
    
    // Create user
    console.log('Creating user account...');
    const signUpResponse = await EmailPassword.signUp("public", ADMIN_EMAIL, ADMIN_PASSWORD);
    
    if (signUpResponse.status === "OK") {
      console.log('User created successfully:', signUpResponse.user.id);
      
      // Assign admin role
      console.log('Assigning admin role...');
      const roleResponse = await UserRoles.addRoleToUser("public", signUpResponse.user.id, "admin");
      
      if (roleResponse.status === "OK") {
        console.log('Admin role assigned successfully');
      } else {
        console.log('Failed to assign admin role:', roleResponse.status);
      }
      
      console.log('✅ Admin user setup completed successfully');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Password:', ADMIN_PASSWORD);
      console.log('Login URL: http://localhost:3000/auth/login');
      
    } else if (signUpResponse.status === "EMAIL_ALREADY_EXISTS_ERROR") {
      console.log('Admin user already exists, ensuring role assignment...');
      
      // Try to assign role to existing user
      try {
        // Use signIn to get user ID
        const signInResponse = await EmailPassword.signIn("public", ADMIN_EMAIL, ADMIN_PASSWORD);
        if (signInResponse.status === "OK") {
          console.log('Found existing user:', signInResponse.user.id);
          const roleResponse = await UserRoles.addRoleToUser("public", signInResponse.user.id, "admin");
          console.log('Role assignment status:', roleResponse.status);
        } else {
          console.log('Could not sign in to assign role. User may need password reset.');
        }
      } catch (error) {
        console.log('Could not assign role to existing user:', error.message);
      }
      
      console.log('✅ Admin user already exists');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Login URL: http://localhost:3000/auth/login');
    } else {
      console.error('❌ Failed to create user:', signUpResponse.status);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the admin user creation
createAdminUser().then(() => {
  console.log('Admin setup script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});