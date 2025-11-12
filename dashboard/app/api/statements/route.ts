import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/v1/statements${queryString ? `?${queryString}` : ""}`;

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
    console.error("Error fetching statements:", error);
    return NextResponse.json(
      { error: "Failed to fetch statements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${API_BASE_URL}/api/v1/statements`;

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
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating statement:", error);
    return NextResponse.json(
      { error: "Failed to create statement" },
      { status: 500 }
    );
  }
}
