import { prisma } from "../config/prisma";

export const createRelationship = async (
  civilizationAId: string,
  civilizationBId: string
) => {
  const existing = await prisma.diplomacy.findFirst({
    where: {
      OR: [
        { civilizationAId, civilizationBId },
        { civilizationAId: civilizationBId, civilizationBId: civilizationAId }
      ]
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
      treatyType: "None",
      embassy: false,
      rivalry: false,
      sanctions: false,
    },
  });
};

export const updateRelationship = async (
  diplomacyId: string,
  relationship: string
) => {
  return prisma.diplomacy.update({
    where: { id: diplomacyId },
    data: { relationship },
  });
};

export const establishEmbassy = async (diplomacyId: string) => {
  return prisma.diplomacy.update({
    where: { id: diplomacyId },
    data: { embassy: true }
  });
};

export const proposeTreaty = async (diplomacyId: string, treatyType: string) => {
  let relationship = "Neutral";
  if (treatyType === "Alliance" || treatyType === "NonAggression" || treatyType === "Trade") {
    relationship = "Friendly";
  }
  
  return prisma.diplomacy.update({
    where: { id: diplomacyId },
    data: { treatyType, relationship }
  });
};

export const declareRivalry = async (diplomacyId: string, enabled: boolean) => {
  return prisma.diplomacy.update({
    where: { id: diplomacyId },
    data: {
      rivalry: enabled,
      relationship: enabled ? "Hostile" : "Neutral",
      treatyType: enabled ? "None" : undefined
    }
  });
};

export const applySanctions = async (diplomacyId: string, enabled: boolean) => {
  return prisma.diplomacy.update({
    where: { id: diplomacyId },
    data: { sanctions: enabled }
  });
};

export const getDiplomacyByWorld = async (worldId: string) => {
  const civilizations = await prisma.civilization.findMany({
    where: {
      species: {
        worldId: worldId
      }
    }
  });

  const civIds = civilizations.map(c => c.id);

  return prisma.diplomacy.findMany({
    where: {
      civilizationAId: { in: civIds },
      civilizationBId: { in: civIds }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
};