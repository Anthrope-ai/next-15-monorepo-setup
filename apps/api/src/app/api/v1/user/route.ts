import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0.ts";
import User from "@/lib/models/User.ts";
import { uploadFile } from "@/lib/adapters/azureStorageAdapter.ts";

const user = new User();

export async function GET(_request: NextRequest) {
  const session = await auth0.getSession();
  const email = session?.user.email;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userDetails = await user.getUserByEmail(email);
    return NextResponse.json(userDetails);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const body = JSON.parse(formData.get("data") as string);

  let fileUrl = null;
  if (file) {
    fileUrl = await uploadFile(file);
  }

  try {
    const newUser = await user.signUp({
      ...body,
      email,
      image: fileUrl || session?.user.picture,
    });

    return NextResponse.json(newUser);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  
  const file = formData.get("file") as File;
  const body = JSON.parse(formData.get("data") as string);

  let fileUrl = null;
  if (file) {
    fileUrl = await uploadFile(file);
  }

  try {
    const updatedUser = await user.updateUser(email, {
      ...body,
      image: fileUrl || body.image, // Update image if a new file is uploaded
    });

    return NextResponse.json(updatedUser);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const session = await auth0.getSession();
  const email = session?.user.email;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const verificationString = body.deleteConfirmationString;
  const emailTyped = body.email;

  if (verificationString !== "Delete my account" && emailTyped !== email) {
    return NextResponse.json({ message: "Cannot delete yet! Did you make up your mind?" }, { status: 400 });
  }

  try {
    return NextResponse.json(await user.deleteUser(email));
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
