import { prisma } from "@/lib/prisma.ts";
import { skipTake } from "@monorepo/lib";

class ReferralLink {
  async createLink(jobId: string, email: string) {
    const linkExists = await prisma.referralLink.findFirst({
      where: {
        jobId,
        user: {
          email
        }
      },
      select: {
        code: true,
        createdAt: true
      }
    });

    if (linkExists) {
      return linkExists;
    }

    return prisma.referralLink.create({
      data: {
        job: {
          connect: {
            id: jobId
          }
        },
        user: {
          connect: {
            email: email
          }
        }
      },
      select: {
        code: true,
        createdAt: true
      }
    });
  }

  async getAllByUser(email: string, page: number, pageSize = 10) {
    return prisma.referralLink.findMany({
      where: {
        user: { email },
        deletedAt: null
      },
      include: {
        job: {
          omit: {
            embedding: true,
            deletedAt: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      omit: {
        jobId: true,
        userId: true
      },
      orderBy: {
        createdAt: "desc"
      },
      ...skipTake(page, pageSize)
    });
  }

  /**
   * This function is for getting a job by referral link code
   * @param code - The referral link code
   * @param incrementClicksCount - Whether to increment the clicks count or not
   *  */
  async getJobByCode(code: string, incrementClicksCount = true) {
    if (incrementClicksCount) {
      await prisma.referralLink.update({
        where: { code },
        data: {
          clicks: {
            increment: 1
          }
        }
      });
    }

    return prisma.job.findFirst({
      where: {
        referralLinks: {
          some: {
            code,
            deactivated: false,
            deletedAt: null
          }
        },
        deletedAt: null,
        deactivated: false
      },
      include: {
        locations: true
      },
      omit: {
        embedding: true,
        deletedAt: true
      }
    });
  }

  async deactivateLink(code: string) {
    return prisma.referralLink.update({
      where: {
        code
      },
      data: {
        deactivated: true
      }
    });
  }

  async deleteLink(code: string) {
    return prisma.referralLink.update({
      where: {
        code
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}

export default ReferralLink;
