import { prisma } from "../config/prisma";

export const calculateMilitaryPower =
  async (civilizationId: string) => {

    const civilization =
      await prisma.civilization.findUnique({
        where: {
          id: civilizationId,
        },

        include: {
          species: true,
          technology: true,
          resource: true,
        },
      });

    if (!civilization) {
      return 0;
    }

    const population =
      civilization.species.population;

    const techLevel =
      civilization.technology?.level ?? 0;

    const metal =
      civilization.resource?.metal ?? 0;

    const energy =
      civilization.resource?.energy ?? 0;

    return (
      population +
      techLevel * 100 +
      metal +
      energy
    );
  };

export const declareWar =
  async (
    attackerId: string,
    defenderId: string,
    year: number
  ) => {

    const attackerPower =
      await calculateMilitaryPower(
        attackerId
      );

    const defenderPower =
      await calculateMilitaryPower(
        defenderId
      );

    const winner =
      attackerPower >= defenderPower
        ? attackerId
        : defenderId;

    const loser =
      winner === attackerId
        ? defenderId
        : attackerId;

    const winnerCivilization =
      await prisma.civilization.findUnique({
        where: {
          id: winner,
        },

        include: {
          species: true,
        },
      });

    const loserCivilization =
      await prisma.civilization.findUnique({
        where: {
          id: loser,
        },

        include: {
          species: true,
        },
      });

    if (
      !winnerCivilization ||
      !loserCivilization
    ) {
      throw new Error(
        "Civilization not found"
      );
    }

    const winnerLoss =
      Math.floor(
        winnerCivilization
          .species.population * 0.05
      );

    const loserLoss =
      Math.floor(
        loserCivilization
          .species.population * 0.20
      );

    await prisma.species.update({
      where: {
        id:
          winnerCivilization.species.id,
      },

      data: {
        population:
          Math.max(
            1,
            winnerCivilization
              .species.population -
              winnerLoss
          ),
      },
    });

    await prisma.species.update({
      where: {
        id:
          loserCivilization.species.id,
      },

      data: {
        population:
          Math.max(
            1,
            loserCivilization
              .species.population -
              loserLoss
          ),
      },
    });

    await prisma.war.create({
      data: {
        attackerId,
        defenderId,
        winner,
        year,
      },
    });

    return {
      winner,
      attackerPower,
      defenderPower,
      winnerLoss,
      loserLoss,
    };
  };

export const getWars =
  async () => {

    return prisma.war.findMany({
      orderBy: {
        year: "desc",
      },
    });

  };