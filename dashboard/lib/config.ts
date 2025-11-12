/**
 * Centralized configuration for the dashboard application
 * All environment variables should be accessed through this file
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    apiPath: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  },
  website: {
    url: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3001",
  },
} as const;

/**
 * Helper to build API URLs consistently
 */
export const getApiUrl = (path: string): string => {
  const base = config.api.baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

/**
 * Helper to build API v1 URLs consistently
 */
export const getApiV1Url = (path: string): string => {
  const base = config.api.apiPath;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
};
