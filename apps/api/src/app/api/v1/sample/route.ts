// Sample route with API auth handler for authentication

import { NextResponse } from "next/server";
import { withAPIAuthHandler } from "@/lib/apiAuthHandler.ts";

export const GET = withAPIAuthHandler(async () => {
  return NextResponse.json({ message: "Hello World" })
});