import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${API_BASE_URL}/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    const frontToken = response.headers.get("front-token");
    const accessToken = response.headers.get("st-access-token");
    const refreshToken = response.headers.get("st-refresh-token");

    if (frontToken) {
      nextResponse.headers.set("front-token", frontToken);
    }
    if (accessToken) {
      nextResponse.headers.set("st-access-token", accessToken);
    }
    if (refreshToken) {
      nextResponse.headers.set("st-refresh-token", refreshToken);
    }

    const setCookieHeaders = response.headers.get("set-cookie");
    if (setCookieHeaders) {
      nextResponse.headers.set("Set-Cookie", setCookieHeaders);
    }

    nextResponse.headers.set(
      "access-control-expose-headers",
      "front-token,st-access-token,st-refresh-token"
    );

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
