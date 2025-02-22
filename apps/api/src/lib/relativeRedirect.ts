import { NextRequest, NextResponse } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";

export function relativeRedirect(url: string, request: NextRequest) {
  return NextResponse.redirect(new URL(addBasePath(url), request.nextUrl.origin));
}
