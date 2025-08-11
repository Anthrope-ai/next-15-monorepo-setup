import { Prisma } from "@prisma/client";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // const fields = (error.meta?.target as string[]) || [];
      return {
        statusCode: 409,
        message: `Duplicate value for fields.`,
      };
    }
  }

  return {
    statusCode: 500,
    message: "Internal server error",
  };
}
