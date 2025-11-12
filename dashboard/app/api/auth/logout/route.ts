import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const url = `${API_BASE_URL}/auth/logout`;

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
      method: "POST",
      headers,
      credentials: "include",
    });

    const data = await response.json();

    const setCookieHeaders = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (setCookieHeaders) {
      nextResponse.headers.set("Set-Cookie", setCookieHeaders);
    }

    return nextResponse;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
