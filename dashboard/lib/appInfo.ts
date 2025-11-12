export const appInfo = {
  appName: "Secure Statement Service",
  apiDomain: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3001",
  apiBasePath: "/auth",
  websiteBasePath: "/login",
};
