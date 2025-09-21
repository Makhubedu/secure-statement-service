import { Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class SuperTokensService {
  constructor() {
    supertokens.init({
      appInfo: {
        appName: process.env.SUPERTOKENS_APP_NAME!,
        apiDomain: process.env.SUPERTOKENS_API_DOMAIN!,
        websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN!,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
      supertokens: {
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
        apiKey: process.env.SUPERTOKENS_API_KEY,
      },
      recipeList: [
        EmailPassword.init({
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                // Conditionally disable public signup - allow during admin setup
                signUpPOST: async function (input) {
                  // Allow signup if it's an admin setup request
                  const isAdminSetup = input.formFields.find(f => f.id === 'email')?.value === process.env.SUPERTOKENS_ADMIN_EMAIL;
                  
                  if (isAdminSetup) {
                    // Allow admin user creation
                    return originalImplementation.signUpPOST!(input);
                  }
                  
                  return {
                    status: "GENERAL_ERROR" as const,
                    message: "Registration is disabled. Contact administrator.",
                  };
                },
              };
            },
          },
        }),
        Session.init({
          cookieSecure: process.env.NODE_ENV === 'production',
          cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          sessionExpiredStatusCode: 401
        }),
        UserRoles.init(),
        Dashboard.init({
          admins: process.env.SUPERTOKENS_DASHBOARD_ADMINS 
            ? process.env.SUPERTOKENS_DASHBOARD_ADMINS.split(',').map(email => email.trim())
            : undefined,
        }),
      ],
    });
  }
}