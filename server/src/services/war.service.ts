import { prisma } from "../config/prisma";

export const calculateMilitaryPower = async (civilizationId: string) => {
  const civilization = await prisma.civilization.findUnique({
    where: { id: civilizationId },
    include: {
      species: true,
      technology: true,
      resource: true,
    },
  });

  if (!civilization) {
    return 0;
  }

  const population = civilization.species.population;
  const techLevel = civilization.technology?.level ?? 0;
  const metal = civilization.resource?.metal ?? 0;
  const energy = civilization.resource?.energy ?? 0;

  return (
    population +
    techLevel * 120 +
    metal +
    energy +
    civilization.militaryPower +
    civilization.fleetStrength * 10
  );
};

export const declareWar = async (
  attackerId: string,
  defenderId: string,
  year: number
) => {
  const attacker = await prisma.civilization.findUnique({
    where: { id: attackerId },
    include: { species: true }
  });
  
  const defender = await prisma.civilization.findUnique({
    where: { id: defenderId },
    include: { species: true }
  });

  if (!attacker || !defender) {
    throw new Error("Civilizations not found");
  }

  const attackerPower = await calculateMilitaryPower(attackerId);
  const defenderPower = await calculateMilitaryPower(defenderId);

  const totalPower = attackerPower + defenderPower;
  const attackerChance = totalPower > 0 ? (attackerPower / totalPower) : 0.5;

  const attackerWon = Math.random() < attackerChance;
  const winnerId = attackerWon ? attackerId : defenderId;
  const loserId = attackerWon ? defenderId : attackerId;

  const winner = attackerWon ? attacker : defender;
  const loser = attackerWon ? defender : attacker;

  const winnerLoss = Math.floor(winner.species.population * 0.08);
  const loserLoss = Math.floor(loser.species.population * 0.22);

  await prisma.species.update({
    where: { id: winner.species.id },
    data: {
      population: Math.max(1, winner.species.population - winnerLoss),
    },
  });

  await prisma.species.update({
    where: { id: loser.species.id },
    data: {
      population: Math.max(1, loser.species.population - loserLoss),
    },
  });

  // Conquest Mechanics
  let conquestPlanetId: string | null = null;
  let conquestDescription = "";
  
  if (attackerWon) {
    const defenderPlanets = await prisma.planet.findMany({
      where: { ownerId: defenderId }
    });

    if (defenderPlanets.length > 0) {
      const conqueredPlanet = defenderPlanets[Math.floor(Math.random() * defenderPlanets.length)];
      conquestPlanetId = conqueredPlanet.id;

      await prisma.planet.update({
        where: { id: conqueredPlanet.id },
        data: { ownerId: attackerId }
      });
      conquestDescription = `Conquered the planet "${conqueredPlanet.name}".`;
    }
  }

  const war = await prisma.war.create({
    data: {
      attackerId,
      defenderId,
      winner: winnerId,
      year,
      status: "Resolved",
      conquestPlanetId,
    },
  });

  return {
    winner,
    winnerLoss,
    loserLoss,
    conquestDescription,
    attackerPower,
    defenderPower,
    attackerChance,
  };
};

export const getWars = async () => {
  return prisma.war.findMany({
    orderBy: {
      year: "desc",
    },
  });
};

export const getWarsByWorld = async (worldId: string) => {
  const civilizations = await prisma.civilization.findMany({
    where: {
      species: {
        worldId: worldId
      }
    }
  });

  const civIds = civilizations.map(c => c.id);

  return prisma.war.findMany({
    where: {
      OR: [
        { attackerId: { in: civIds } },
        { defenderId: { in: civIds } }
      ]
    },
    orderBy: {
      year: "desc"
    }
  });
};