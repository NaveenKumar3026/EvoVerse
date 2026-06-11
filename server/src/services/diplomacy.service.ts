import { prisma } from "../config/prisma";

export const createRelationship =
  async (
    civilizationAId: string,
    civilizationBId: string
  ) => {

    const existing =
      await prisma.diplomacy.findFirst({
        where: {
          civilizationAId,
          civilizationBId,
        },
      });

    if (existing) {
      return existing;
    }

    return prisma.diplomacy.create({
      data: {
        civilizationAId,
        civilizationBId,
        relationship: "Neutral",
      },
    });
  };

export const updateRelationship =
  async (
    diplomacyId: string,
    relationship: string
  ) => {

    return prisma.diplomacy.update({
      where: {
        id: diplomacyId,
      },

      data: {
        relationship,
      },
    });
  };