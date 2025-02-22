import {
  CreateJobDTO,
  createJobSchema,
  JobFilterParams,
  UpdateJobDTO,
  updateJobSchema
} from "@monorepo/types";
import { prisma } from "@/lib/prisma.ts";
import { Prisma } from "@prisma/client";
import { skipTake } from "@monorepo/lib";
import AdminOnly from "@/lib/AdminOnly.ts";

class Jobs {
  @AdminOnly()
  async getCompletedJobs() {
    return prisma.job.count({
      where: {
        deactivated: false
      }
    });
  }

  // Todo: Ask bhaiya
  @AdminOnly()
  async getRecentJobs() {
    return prisma.job.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        locations: {
          select: { city: true }
        },
        _count: {
          select: {
            referralLinks: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 6
    });

    // const referralsData = await prisma.application.groupBy({
    //   by: ["jobId"],
    //   _count: {
    //     referredById: true
    //   }
    // });

    // return recentJobs.map(job => {
    //   const referral = referralsData.filter(r => r.jobId === job.id);
    //   return {
    //     ...job,
    //     // @ts-ignore
    //     users: referral.length > 0 ? referral.reduce((total, r) => total + r._count.referredById) : 0
    //   };
    // });
  }

  async createJob(jobData: CreateJobDTO) {
    const job = await createJobSchema.validate(jobData);
    return prisma.job.create({
      data: job as unknown as Prisma.JobCreateInput
    });
  }

  async updateJob(id: string, jobData: UpdateJobDTO) {
    const job = await updateJobSchema.validate(jobData);

    return prisma.job.update({
      where: {
        id
      },
      data: job as unknown as Prisma.JobUpdateInput
    });
  }

  async getJobs(page: number, filters: JobFilterParams, email?: string, pageSize = 10) {
    const titleFilter = filters.title
      ? {
          title: {
            contains: filters.title,
            mode: "insensitive" as Prisma.QueryMode // Explicitly cast "insensitive" to Prisma.QueryMode
          }
        }
      : {};

    const minExpFilter =
      filters.minExperience !== undefined
        ? {
            minExperience: {
              gte: filters.minExperience
            }
          }
        : null;

    const maxExpFilter = filters.maxExperience
      ? {
          maxExperience: {
            lte: filters.maxExperience
          }
        }
      : null;

    const filter = {
      ...titleFilter,
      AND: [minExpFilter, maxExpFilter].filter(item => item !== null)
    };

    const totalCount = await prisma.job.count({
      where: {
        deletedAt: null,
        ...(filter as Prisma.JobWhereInput)
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await prisma.job.findMany({
      where: {
        deletedAt: null,
        ...(filter as Prisma.JobWhereInput)
      },
      include: {
        locations: true,
        referralLinks: {
          where: {
            user: {
              email
            }
          },
          select: {
            code: true,
            createdAt: true
          }
        }
      },
      omit: {
        embedding: true,
        deletedAt: true
      },
      orderBy: {
        createdAt: "desc"
      },
      ...skipTake(page, pageSize)
    });

    const sendableData = data.map(item => {
      const referralLink = item.referralLinks?.[0] || undefined;
      return {
        ...item,
        referralLink,
        referralLinks: undefined
      };
    });

    return {
      data: sendableData,
      count: totalCount,
      totalPages
    };
  }

  async deleteJob(id: string) {
    return prisma.job.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}

export default Jobs;
