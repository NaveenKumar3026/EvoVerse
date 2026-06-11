import { prisma } from "../config/prisma";

export const createPeaceTreaty =
  async (
    civilizationAId: string,
    civilizationBId: string
  ) => {

    return prisma.diplomacy.updateMany({
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

      data: {
  relationship: "Neutral",
},
    });

  };