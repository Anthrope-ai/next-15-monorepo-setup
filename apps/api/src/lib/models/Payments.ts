import { prisma } from "@/lib/prisma.ts";
import { skipTake } from "@monorepo/lib";
import { PaymentType } from "@prisma/client";
import AdminOnly from "@/lib/AdminOnly.ts";

class Payments {
  @AdminOnly()
  async getPaymentMetrics() {
    const [clearedPayments, pendingPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true }
      })
    ]);

    return {
      clearedPayments: clearedPayments._sum.amount || 0,
      pendingPayments: pendingPayments._sum.amount || 0
    };
  }

  @AdminOnly()
  async getAllPayments(page: number, pageSize = 12) {
    return prisma.payment.findMany({
      include: {
        application: {
          include: {
            referralLink: {
              include: {
                job: true,
                user: true
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
  async getRemainingPayments(page: number, pageSize = 6) {
    return prisma.payment.findMany({
      where: {
        status: "PENDING"
      },
      select: {
        application: {
          select: {
            name: true,
            applicationStage: true,
            updatedAt: true,
            referralLink: {
              select: {
                job: {
                  select: {
                    title: true,
                    bounty: true
                  }
                },
                user: true
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

  async getAllByUser(email: string, page: number, pageSize = 12) {
    return prisma.payment.findMany({
      where: {
        application: {
          referralLink: {
            user: {
              email: email
            }
          }
        }
      },
      include: {
        application: {
          include: {
            referralLink: {
              include: {
                job: true,
                user: true
              }
            }
          }
        }
      },
      omit: {
        notes: true
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

  async createPayment(
    applicationId: string,
    amount: number,
    paymentType: PaymentType,
    notes: string,
    currency: string = "INR"
  ) {
    return prisma.payment.create({
      data: {
        applicationId,
        amount,
        paymentType,
        notes,
        currency
      }
    });
  }

  async updatePayment(_id: string) {}

  async getTotalCleared(email: string) {
    return prisma.payment.aggregate({
      where: {
        application: {
          referralLink: {
            user: {
              email: email
            }
          }
        },
        status: "COMPLETED"
      },
      _sum: {
        amount: true
      }
    });
  }

  async getTotalPending(email: string) {
    return prisma.payment.aggregate({
      where: {
        application: {
          referralLink: {
            user: {
              email: email
            }
          }
        },
        status: "PENDING"
      },
      _sum: {
        amount: true
      }
    });
  }
}

export default Payments;
