const supertokens = require('supertokens-node');
const EmailPassword = require('supertokens-node/recipe/emailpassword');
const Session = require('supertokens-node/recipe/session');
const UserRoles = require('supertokens-node/recipe/userroles');

// Initialize SuperTokens
supertokens.init({
  appInfo: {
    appName: process.env.SUPERTOKENS_APP_NAME || "Secure Statement Service",
    apiDomain: process.env.SUPERTOKENS_API_DOMAIN || "http://localhost:3000",
    websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN || "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "http://localhost:3567",
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
    UserRoles.init(),
  ],
});

async function createAdminUser() {
  try {
    const email = process.env.SUPERTOKENS_ADMIN_EMAIL || "admin@yourdomain.com";
    const password = process.env.SUPERTOKENS_ADMIN_PASSWORD || "AdminPassword123!";
    
    console.log('Creating admin user:', email);
    
    // First, create the admin role if it doesn't exist
    const createRoleResponse = await UserRoles.createNewRoleOrAddPermissions("admin", []);
    console.log('Admin role creation status:', createRoleResponse.status);
    
    // Create user
    const signUpResponse = await EmailPassword.signUp("public", email, password);
    
    if (signUpResponse.status === "OK") {
      console.log('User created successfully:', signUpResponse.user.id);
      
      // Assign admin role
      const roleResponse = await UserRoles.addRoleToUser("public", signUpResponse.user.id, "admin");
      
      if (roleResponse.status === "OK") {
        console.log('Admin role assigned successfully');
      } else {
        console.log('Failed to assign admin role:', roleResponse.status);
      }
      
      console.log('Admin user setup completed');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Login URL: http://localhost:3000/auth/login');
      
    } else if (signUpResponse.status === "EMAIL_ALREADY_EXISTS_ERROR") {
      console.log('Admin user already exists, attempting role assignment...');
      
      // Get user info to assign role
      try {
        // Use signIn to get user info
        const signInResponse = await EmailPassword.signIn("public", email, password);
        if (signInResponse.status === "OK") {
          const roleResponse = await UserRoles.addRoleToUser("public", signInResponse.user.id, "admin");
          console.log('Role assignment status:', roleResponse.status);
        } else {
          // Try getting all users and find by email (for development only)
          const SuperTokens = require('supertokens-node');
          const usersResponse = await SuperTokens.listUsersByAccountInfo("public", { email: email });
          if (usersResponse.length > 0) {
            const roleResponse = await UserRoles.addRoleToUser("public", usersResponse[0].id, "admin");
            console.log('Role assignment status:', roleResponse.status);
          }
        }
      } catch (error) {
        console.log('Could not assign role to existing user:', error.message);
      }
      
      console.log('Email:', email);
      console.log('Login URL: http://localhost:3000/auth/login');
    } else {
      console.error('Failed to create user:', signUpResponse.status);
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();