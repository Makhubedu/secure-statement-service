export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    apiPath: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  },
  website: {
    url: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3001",
  },
} as const;

export const appInfo = {
  appName: "Secure Statement Service",
  apiDomain: config.api.baseUrl,
  websiteDomain: config.website.url,
  apiBasePath: "/auth",
  websiteBasePath: "/login",
} as const;

export const getApiUrl = (path: string): string => {
  const base = config.api.baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const getApiV1Url = (path: string): string => {
  const base = config.api.apiPath;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
};
