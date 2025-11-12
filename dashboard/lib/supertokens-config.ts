import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo, getApiUrl } from "./config";

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            style: `
              [data-supertokens~=headerSubtitle] {
                display: none;
              }
            `,
          },
        },
        onHandleEvent: async (context) => {
          if (context.action === "SUCCESS") {
            try {
              await fetch(getApiUrl("/auth/me"), { credentials: "include" });
            } catch {
            }
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
