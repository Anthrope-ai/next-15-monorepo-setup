import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { handlePrismaError } from "@/lib/prismaErrorHandler.ts";

type Handler = (user: { email: string }) => Promise<Response>;

export function withAPIAuthHandler(handler: Handler) {
  return async function () {
    const session = await auth0.getSession();

    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ message: "Not Logged in" }, { status: 401 });
    // }

    try {
      return await handler({ email: session?.user.email || "" });
    } catch (error: unknown) {
      const { statusCode, message } = handlePrismaError(error);

      let errorMessage: string;

      if (statusCode || message) {
        errorMessage =  message;
      } else if (error instanceof Error) {
        errorMessage = "Something went wrong: " + error.message;
      } else if (typeof error === "string") {
        errorMessage = "Caught a string error: " + error;
      } else {
        errorMessage = "Caught an unknown error type: " + JSON.stringify(error);
      }

      console.error(errorMessage);
      return NextResponse.json({ message: errorMessage }, { status: statusCode || 500 });
    }
  };
}
