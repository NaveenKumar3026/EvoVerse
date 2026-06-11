import { prisma } from "../config/prisma";

export const getWorldStatistics =
  async (worldId: string) => {

    const world =
      await prisma.world.findUnique({
        where: {
          id: worldId,
        },
      });

    const speciesCount =
      await prisma.species.count({
        where: {
          worldId,
        },
      });

    const civilizationCount =
      await prisma.civilization.count();

    const warCount =
      await prisma.war.count();

    const allianceCount =
      await prisma.alliance.count();

    const tradeCount =
      await prisma.trade.count();

    return {
      currentYear:
        world?.currentYear ?? 0,

      speciesCount,
      civilizationCount,
      warCount,
      allianceCount,
      tradeCount,
    };
  };