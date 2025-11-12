import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const url = `${API_BASE_URL}/auth/me`;

    const cookies = request.headers.get("cookie");
    const frontToken = request.headers.get("front-token");
    const accessToken = request.headers.get("st-access-token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (cookies) {
      headers["Cookie"] = cookies;
    }
    if (frontToken) {
      headers["front-token"] = frontToken;
    }
    if (accessToken) {
      headers["st-access-token"] = accessToken;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user info" },
      { status: 500 }
    );
  }
}
