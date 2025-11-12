import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { getApiUrl } from "./config";

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            // Disable sign up - only admins can be created via backend script
            style: `
              [data-supertokens~=headerSubtitle] {
                display: none;
              }
            `,
          },
        },
        onHandleEvent: async (context) => {
          // Extra safety: if sign in/up succeeds, do a hard redirect to avoid router caching issues
          if (context.action === "SUCCESS") {
            try {
              // optional: ping backend so cookies are applied before navigation
              await fetch(getApiUrl("/auth/me"), { credentials: "include" });
            } catch {}
            if (window.location.pathname === "/login") {
              window.location.replace("/dashboard");
            }
          }
        },
      }),
      SessionReact.init({
        tokenTransferMethod: "cookie",
      }),
    ],
  };
};
