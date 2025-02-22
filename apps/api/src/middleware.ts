import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const exceptionPaths = ["/api/v1/public"];

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const session = await auth0.getSession(request);

  if (!session) {
    // Exceptions from login enforcement
    for (let exceptionPath of exceptionPaths) {
      if (pathName.startsWith(exceptionPath)) {
        return NextResponse.next();
      }
    }

    // user is not authenticated, redirect to login page
    return NextResponse.json(
      {
        message: "Unauthorized"
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}
