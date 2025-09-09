import { NextRequest, NextResponse } from "next/server";

// const exceptionPaths = ["/api/v1/public"];

export async function middleware(_request: NextRequest) {
  // Uncomment the below code block if user should login before accessing any of the applications
  //
  // const pathName = request.nextUrl.pathname;
  //
  // const session = await auth0.getSession(request);
  //
  // if (!session) {
  //   // Exceptions from login enforcement
  //   for (let exceptionPath of exceptionPaths) {
  //     if (pathName.startsWith(exceptionPath)) {
  //       return NextResponse.next();
  //     }
  //   }
  //
  //   // user is not authenticated, redirect to login page
  //   return NextResponse.json(
  //     {
  //       message: "Unauthorized"
  //     },
  //     { status: 401 }
  //   );
  // }

  return NextResponse.next();
}
