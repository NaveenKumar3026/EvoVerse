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
    };
  };