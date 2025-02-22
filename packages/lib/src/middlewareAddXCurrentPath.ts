import { NextRequest, NextResponse } from "next/server";

export function middlewareAddXCurrentPath(request: NextRequest, prevRes: NextResponse) {
  const resWithCombinedHeaders = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  prevRes.headers.forEach((value, key) => {
    resWithCombinedHeaders.headers.set(key, value);
  });

  resWithCombinedHeaders.headers.set("x-current-path", request.nextUrl.pathname);

  return resWithCombinedHeaders;
}
