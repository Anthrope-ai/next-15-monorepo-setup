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
      },
      omit: {
        id: true,
        deletedAt: true,
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
      },
      omit: {
        email: true,
        deletedAt: true,
      }
    });
  }

  async getAll(page: number, name?: string, email?: string, pageSize = 20) {
    return prisma.user.findMany({
      ...skipTake(page, pageSize),
      where: {
        email: { startsWith: email },
        name: { contains: name }
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  }
}

export default User;
