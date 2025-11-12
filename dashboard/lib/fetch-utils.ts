/**
 * Utility function to make authenticated API calls
 * Automatically includes SuperTokens headers from sessionStorage
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get tokens from sessionStorage
  const frontToken = sessionStorage.getItem("front-token");
  const accessToken = sessionStorage.getItem("st-access-token");

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add any existing headers from options
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add SuperTokens headers if available
  if (frontToken) {
    headers["front-token"] = frontToken;
  }
  if (accessToken) {
    headers["st-access-token"] = accessToken;
  }

  // Make the request with credentials
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}
