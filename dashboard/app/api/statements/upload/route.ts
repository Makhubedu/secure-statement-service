import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = `${API_BASE_URL}/api/v1/statements/upload`;

    // Get SuperTokens cookies - these are the critical ones for authentication
    const sAccessToken = request.cookies.get("sAccessToken");
    const sRefreshToken = request.cookies.get("sRefreshToken");
    
    // Build cookie header with SuperTokens session cookies
    const cookieParts: string[] = [];
    if (sAccessToken) {
      cookieParts.push(`sAccessToken=${sAccessToken.value}`);
    }
    if (sRefreshToken) {
      cookieParts.push(`sRefreshToken=${sRefreshToken.value}`);
    }
    
    const cookieHeader = cookieParts.join('; ');
    
    const frontToken = request.headers.get("front-token");

    const headers: HeadersInit = {};

    // CRITICAL: Add SuperTokens session cookies
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }
    
    // Add SuperTokens front-token (anti-CSRF)
    if (frontToken) {
      headers["front-token"] = frontToken;
    }

    console.log("Uploading to:", url);
    console.log("Has session cookies:", !!cookieHeader);
    console.log("Has front-token:", !!frontToken);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Upload failed:", response.status, data);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error uploading statement:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload statement", error: String(error) },
      { status: 500 }
    );
  }
}
