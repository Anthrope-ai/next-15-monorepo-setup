import { prisma } from "@/lib/prisma";
import { CreateUserDTO, createUserSchema, UpdateUserDTO, updateUserSchema } from "@monorepo/types";
import { skipTake } from "@monorepo/lib";

class User {
  async signUp(details: CreateUserDTO) {
    const user = await createUserSchema.validate(details, {
      strict: true
    });

    const userExists = await prisma.user.findFirst({
      where: {
        email: user.email
      },
      select: {
        id: true,
        deletedAt: true
      }
    });

    if (userExists && !userExists.deletedAt) {
      throw new Error("User already exists");
    } else if (userExists && userExists.deletedAt) {
      await prisma.user.update({
        where: {
          id: userExists.id
        },
        data: {
          email: "Deleted" + user.email
        }
      });
    }

    return prisma.user.create({
      data: {
        ...details,
        email: user.email,
        skills: (details.skills as string[]) || []
      },
      omit: {
        id: true,
        deletedAt: true,
        onboarded: true,
        userType: true
      }
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      },
      omit: {
        deletedAt: true,
        updatedAt: true,
        userType: true,
        id: true
      }
    });
  }

  async deleteUser(email: string) {
    return prisma.user.update({
      where: {
        email
      },
      data: {
        deletedAt: new Date()
      },
      omit: {
        id: true,
        deletedAt: true,
        onboarded: true,
        userType: true
      }
    });
  }

  async updateUser(email: string, details: UpdateUserDTO) {
    const userExists = await prisma.user.findFirstOrThrow({
      where: {
        email,
        deletedAt: null
      },
      select: {
        id: true,
        deletedAt: true
      }
    });

    if (userExists.deletedAt) {
      throw new Error("User does not exist");
    }

    const user = await updateUserSchema.validate(details, {
      strict: true
    });

    return prisma.user.update({
      where: {
        email
      },
      data: {
        ...user,
        skills: (details.skills as string[]) || []
      },
      omit: {
        email: true,
        deletedAt: true,
        onboarded: true,
        userType: true
      }
    });
  }

  async doesUserExistAndOnboarded(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      },
      select: {
        onboarded: true
      }
    });

    return {
      exists: !!user,
      onboarded: user?.onboarded || false
    };
  }

  async markOnboarded(email: string) {
    return prisma.user.update({
      where: {
        email,
        deletedAt: null
      },
      data: {
        onboarded: true
      },
      select: {
        email: true
      }
    });
  }

  async isUserAdmin(email: string) {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
        deletedAt: null
      },
      select: {
        userType: true
      }
    });

    return user.userType === "ADMIN";
  }

  async getAll(page: number, name?: string, email?: string, pageSize = 20) {
    const users = await prisma.user.findMany({
      ...skipTake(page, pageSize),
      where: {
        email: { startsWith: email },
        name: { contains: name }
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        // This fetches all referral links (for each user)
        // along with a count of applications under each link
        referralLinks: {
          include: {
            _count: {
              select: { applications: true }
            }
          }
        }
      }
    });

    // Sum up the applications across all referralLinks for each user
    return users.map(user => {
      const totalReferredApplications = user.referralLinks.reduce(
        (sum, link) => sum + link._count.applications,
        0
      );
      return {
        ...user,
        totalReferredApplications
      };
    });
  }
}

export default User;
