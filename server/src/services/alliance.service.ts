import { prisma } from "../config/prisma";

export const formAlliance =
  async (
    civilizationAId: string,
    civilizationBId: string
  ) => {

    const existing =
      await prisma.alliance.findFirst({
        where: {
          OR: [
            {
              civilizationAId,
              civilizationBId,
            },
            {
              civilizationAId:
                civilizationBId,

              civilizationBId:
                civilizationAId,
            },
          ],
        },
      });

    if (existing) {
      return existing;
    }

    return prisma.alliance.create({
      data: {
        civilizationAId,
        civilizationBId,
      },
    });
  };