import { prisma } from "@/lib/prisma.ts";
import { skipTake } from "@monorepo/lib";
import { ApplicationStages } from "@prisma/client";
import { endOfWeek, format, startOfWeek, subMonths } from "date-fns";
import AdminOnly from "@/lib/AdminOnly.ts";

class Referrals {
  @AdminOnly()
  async getAllReferrals(page: number, pageSize = 12) {
    return prisma.application.findMany({
      select: {
        name: true,
        email: true,
        createdAt: true,
        applicationStage: true,
        referralLink: {
          select: {
            code: true,
            job: {
              select: {
                id: true,
                title: true,
                createdAt: true,
                deactivated: true,
                deletedAt: true,
                locations: true,
                bounty: true
              }
            },
            user: {
              select: {
                name: true,
                email: true
              }
            }
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

  @AdminOnly()
  async getReferralsCountPerJob() {
    const referralsPerJob = await prisma.referralLink.groupBy({
      by: ["jobId"],
      _count: { jobId: true }
    });

    const jobs = await prisma.job.findMany({
      where: { id: { in: referralsPerJob.map(r => r.jobId) } },
      select: { id: true, title: true }
    });

    return referralsPerJob.map(referral => ({
      jobId: referral.jobId,
      jobTitle: jobs.find(job => job.id === referral.jobId)?.title || "Unknown Job",
      count: referral._count.jobId
    }));
  }

  @AdminOnly()
  async getPerformanceMetrics() {
    const [totalApplications, clicksSum, hiredCount, totalReferrals] = await Promise.all([
      prisma.application.count(),
      prisma.referralLink.aggregate({ _sum: { clicks: true } }),
      prisma.application.count({ where: { applicationStage: ApplicationStages.HIRED } }),
      prisma.referralLink.count()
    ]);

    const clickThroughRate = clicksSum._sum.clicks
      ? parseFloat(((totalApplications / clicksSum._sum.clicks) * 100).toFixed(2))
      : 0;

    const referralSuccessRate = parseFloat(((hiredCount / totalReferrals) * 100).toFixed(2));

    return { totalReferrals, clickThroughRate, referralSuccessRate };
  }

  @AdminOnly()
  async getMonthlyReferrals() {
    const sixMonthsAgo = subMonths(new Date(), 6);

    const referrals = await prisma.referralLink.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });

    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return format(date, "MMMM");
    }).reverse();

    const monthlyCounts = months.reduce(
      (acc, month) => {
        acc[month] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    referrals.forEach(referral => {
      const month = format(referral.createdAt, "MMMM");
      monthlyCounts[month] += 1;
    });

    return Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));
  }

  @AdminOnly()
  async getReferralsCountPerLocation() {
    const referralsPerJob = await prisma.referralLink.groupBy({
      by: ["jobId"],
      _count: { jobId: true }
    });

    const jobsWithLocations = await prisma.job.findMany({
      where: { id: { in: referralsPerJob.map(r => r.jobId) } },
      select: {
        locations: {
          select: {
            city: true
          }
        }
      }
    });

    return jobsWithLocations.reduce(
      (acc: Record<string, number>, job: any) => {
        job.locations.forEach((location: any) => {
          const city = location.city;
          acc[city] = (acc[city] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );
  }

  async getAllByUser(email: string, page: number, pageSize = 12) {
    return prisma.application.findMany({
      where: {
        referralLink: {
          user: {
            email
          }
        }
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        applicationStage: true,
        referralLink: {
          select: {
            code: true,
            job: {
              select: {
                id: true,
                title: true,
                createdAt: true,
                deactivated: true,
                deletedAt: true,
                locations: true,
                bounty: true
              }
            }
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

  async getByCode(code: string, page: number, pageSize = 12) {
    return prisma.application.findMany({
      where: {
        referralLink: {
          code
        }
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        applicationStage: true,
        updatedAt: true,
        referralLink: {
          select: {
            code: true,
            createdAt: true,
            clicks: true,
            deactivated: true,
            job: true,
            user: true
          }
        }
      },
      orderBy: [
        {
          createdAt: "desc"
        }
      ],
      ...skipTake(page, pageSize)
    });
  }

  async getByJob(jobId: string, email: string, page: number, pageSize = 12) {
    return prisma.application.findMany({
      where: {
        referralLink: {
          job: {
            id: jobId
          },
          user: {
            email
          }
        }
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        applicationStage: true
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

  async getTotalBounty(email: string) {
    const applications = await prisma.application.findMany({
      where: {
        referralLink: {
          user: {
            email: email
          }
        },
        applicationStage: ApplicationStages.HIRED
      },
      select: {
        referralLink: {
          select: {
            job: {
              select: {
                bounty: true
              }
            }
          }
        }
      }
    });

    return applications.reduce((sum, app) => sum + (app.referralLink?.job?.bounty || 0), 0);
  }

  async getWeeklyBounty(email: string) {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

    const applications = await prisma.application.findMany({
      where: {
        referralLink: {
          user: {
            email: email
          }
        },
        applicationStage: ApplicationStages.HIRED,
        OR: [
          {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            updatedAt: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      },
      select: {
        referralLink: {
          select: {
            job: {
              select: {
                bounty: true
              }
            }
          }
        }
      }
    });

    return applications.reduce((sum, app) => sum + (app.referralLink?.job?.bounty || 0), 0);
  }
}

export default Referrals;
