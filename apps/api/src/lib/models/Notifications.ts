import { prisma } from "@/lib/prisma.ts";
import { skipTake } from "@monorepo/lib";

class Notifications {
  async getAllNotifications(email: string, page: number, showRead = false, pageSize = 8) {
    return prisma.notification.findMany({
      where: {
        user: { email },
        read: showRead ? undefined : false
      },
      orderBy: {
        createdAt: "desc"
      },
      omit: {
        updatedAt: true
      },
      ...skipTake(page, pageSize)
    });
  }

  async createNotification(email: string, title: string, message: string, action?: string) {
    return prisma.notification.create({
      data: {
        user: {
          connect: {
            email
          }
        },
        title,
        message: message,
        action: action,
        read: false
      },
      omit: {
        updatedAt: true
      }
    });
  }

  async updateNotification(id: string, read: boolean) {
    return prisma.notification.update({
      where: {
        id
      },
      data: {
        read
      },
      omit: {
        updatedAt: true
      }
    });
  }
}

export default Notifications;
