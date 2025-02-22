import { NextRequest, NextResponse } from "next/server";
import { addBasePath } from "next/dist/client/add-base-path";

export function relativeRedirect(path: string, request: NextRequest, skipAddingBasePath = false) {
  return NextResponse.redirect(
    new URL(skipAddingBasePath ? path : addBasePath(path), request.nextUrl.origin)
  );
}
