import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";
import { middlewareAddXCurrentPath, relativeRedirect } from "@monorepo/lib";

// Paths which are exempted from login
const exceptionPaths = ["/api/v1/public"];

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");
  const authRes = await auth0.middleware(request);

  const pathName = request.nextUrl.pathname;
  if (pathName.startsWith("/auth")) {
    return authRes;
  }

  const resWithXPathHeader = middlewareAddXCurrentPath(request, authRes);

  const session = await auth0.getSession(request);

  if (!session) {
    // Exceptions from login enforcement
    for (let exceptionPath of exceptionPaths) {
      if (pathName.startsWith(exceptionPath)) {
        return resWithXPathHeader;
      }
    }

    // user is not authenticated, redirect to login page, skipping adding basepath
    return relativeRedirect("/auth/login", request, true);
  }

  if (pathName.includes("/verify-email")) {
    return resWithXPathHeader;
  }

  if (pathName === "/" || pathName.endsWith("/app")) {
    return relativeRedirect("/home", request);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
