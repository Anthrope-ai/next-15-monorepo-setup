import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0.ts";
import { validatePassword } from "@monorepo/lib";
import { managementClientFactory } from "@/lib/managementClientFactory.ts";

export async function PUT(request: NextRequest) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Check for valid session
  if (!session.user.sub.startsWith("auth0")) {
    return NextResponse.json({ message: "You must be logged in with email & password" }, { status: 400 });
  }

  const { password } = await request.json();

  const { valid, errorMessage } = validatePassword(password);

  if (!valid) {
    console.log("Password not valid");
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }

  try {
    const auth0ManagementClient = managementClientFactory();
    await auth0ManagementClient.users.update(
      {
        id: session.user.sub
      },
      {
        password: password
      }
    );

    return NextResponse.json({ message: "Password Changed successfully" });
  } catch (e: any) {
    console.log("Error changing password");
    console.log(e);
    return NextResponse.json({ message: "Failed to change the password" }, { status: 500 });
  }
}
