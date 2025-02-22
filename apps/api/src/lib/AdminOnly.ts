import { prisma } from "@/lib/prisma.ts";
import { auth0 } from "@/lib/auth0.ts";
import { $$, UnauthorizedError } from "@monorepo/lib";
import { UserType } from "@prisma/client";

export default function AdminOnly() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const session = await auth0.getSession();

      if (!session || !session.user.email_verified) {
        throw new UnauthorizedError("Email not verified or Need to login");
      }

      const email = session.user.email!;
      const emailOrigin = email.split("@").pop()!;

      if ($$.ALLOWED_ORIGINS.indexOf(emailOrigin) !== -1) {
        console.log("Access Granted");
        return originalMethod.apply(this, args);
      }

      const user = await prisma.user.findFirst({
        where: { email: session.user.email },
        select: { userType: true }
      });

      if (!user || user.userType !== UserType.ADMIN) {
        console.log("Admin access breach prevented");
        throw new UnauthorizedError();
      }

      console.log("Access Granted after all checks");
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
