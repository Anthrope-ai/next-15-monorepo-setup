import { prisma } from "@/lib/prisma.ts";
import { Prisma } from "@prisma/client";
import { CustomError, skipTake } from "@monorepo/lib";
import AdminOnly from "@/lib/AdminOnly.ts";
import { CreateApplicationDTO } from "@monorepo/types";

class Applications {
  @AdminOnly()
  async getAllApplications(page: number, pageSize = 12) {
    return prisma.application.findMany({
      include: {
        referralLink: {
          include: {
            job: true,
            user: true
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc"
        },
        {
          createdAt: "desc"
        }
      ],
      ...skipTake(page, pageSize)
    });
  }

  async getAllByUser(email: string, page: number, pageSize = 12) {
    return prisma.application.findMany({
      where: {
        referralLink: {
          user: {
            email: email
          }
        }
      },
      include: {
        referralLink: {
          include: {
            job: true,
            user: true
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc"
        },
        {
          createdAt: "desc"
        }
      ],
      ...skipTake(page, pageSize)
    });
  }

  async createApplication(applicationData: CreateApplicationDTO, code: string) {
    // Fetch the referral link
    const referralLink = await prisma.referralLink.findUnique({
      where: { code: code }
    });

    if (!referralLink) {
      throw new CustomError("Invalid referral code", "CodeNotFound", 400);
    }

    // Create the application with the correct data
    return prisma.application.create({
      data: {
        ...applicationData,
        referredById: referralLink.userId,
        jobId: referralLink.jobId
      } as unknown as Prisma.ApplicationCreateInput
    });
  }

  async updateApplication(id: string, application: CreateApplicationDTO) {
    return prisma.application.update({
      where: {
        id: id
      },
      data: application as unknown as Prisma.ApplicationUpdateInput
    });
  }
}

export default Applications;
