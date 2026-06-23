import { prisma } from "../config/prisma";
import { mutateSpecies } from "./mutation.service";
import { triggerDisaster } from "./disaster.service";
import { advanceTechnology } from "./technology.service";
import { manageResources } from "./resource.service";
import { declareWar } from "./war.service";
import { createRelationship, updateRelationship } from "./diplomacy.service";
import { formAlliance } from "./alliance.service";
import { createTrade } from "./trade.service";
import { createPeaceTreaty } from "./peace.service";
import { createPendingDecision } from "./decision.service";

const attemptColonization = async (civilizationId: string, worldId: string) => {
  const civilization = await prisma.civilization.findUnique({
    where: { id: civilizationId }
  });

  if (!civilization) return null;

  let techs: string[] = [];
  try {
    techs = JSON.parse(civilization.technologiesJson || "[]");
  } catch {
    techs = [];
  }

  // Check if they have space travel
  if (!techs.includes("Space Travel") && !techs.includes("Interstellar Travel")) {
    return null;
  }

  // Find uncolonized planet
  const uncolonizedPlanet = await prisma.planet.findFirst({
    where: {
      ownerId: null,
      starSystem: {
        worldId: worldId
      }
    }
  });

  if (uncolonizedPlanet) {
    await prisma.planet.update({
      where: { id: uncolonizedPlanet.id },
      data: { ownerId: civilizationId }
    });

    await prisma.civilization.update({
      where: { id: civilizationId },
      data: {
        fleetStrength: { increment: 5 },
        militaryPower: { increment: 50 }
      }
    });

    return uncolonizedPlanet;
  }

  return null;
};

export const runEvolution = async (
  worldId: string,
  years: number
) => {
  const events: string[] = [];

  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: {
      species: {
        include: {
          dna: true,
        },
      },
    },
  });

  if (!world) {
    throw new Error("World not found");
  }

  // 1. Check for existing pending decision
  const pendingDecision = await prisma.playerDecision.findFirst({
    where: { worldId, choiceMade: -1 }
  });

  if (pendingDecision) {
    return {
      worldId,
      yearsSimulated: 0,
      halted: true,
      pendingDecision,
      events: ["Simulation halted. A critical decision requires commander input."]
    };
  }

  let finalYearsSimulated = 0;

  for (let year = 1; year <= years; year++) {
    const currentSimulatedYear = world.currentYear + year;

    // 2. Halt check: Every 30 years, trigger an interactive decision
    if (currentSimulatedYear > 0 && currentSimulatedYear % 30 === 0) {
      const decision = await createPendingDecision(worldId, currentSimulatedYear);

      // Save progress up to this year
      await prisma.world.update({
        where: { id: worldId },
        data: { currentYear: currentSimulatedYear },
      });

      // Award partial Commander XP
      await awardCommanderXp(world.userId, year * 10);

      events.push(`Year ${currentSimulatedYear}: Critical Galactic Event triggered. Simulation paused for decision.`);

      return {
        worldId,
        yearsSimulated: year,
        newCurrentYear: currentSimulatedYear,
        halted: true,
        pendingDecision: decision,
        events,
      };
    }

    // Run normal year simulation loops for each species
    for (const species of world.species) {
      if (!species.dna) continue;

      let currentPopulation = species.population;

      // Population Growth
      const growth =
        species.dna.adaptability / 20 +
        species.dna.intelligence / 40 -
        species.dna.aggression / 30;

      currentPopulation = Math.max(
        1,
        Math.floor(currentPopulation + growth)
      );

      await prisma.species.update({
        where: { id: species.id },
        data: { population: currentPopulation },
      });

      // Disaster Chance
      if (Math.random() < world.disasterFrequency / 100) {
        const disaster = await triggerDisaster(
          worldId,
          species.id,
          currentPopulation,
          currentSimulatedYear
        );

        currentPopulation = disaster.remainingPopulation;
        events.push(`Year ${currentSimulatedYear}: ${disaster.disaster} killed ${disaster.loss} population on ${species.name}`);
      }

      // Mutation Chance
      if (Math.random() < 0.20) {
        const mutation = await mutateSpecies(species.id);
        const description = `${species.name} mutated in ${mutation.trait}`;
        events.push(`Year ${currentSimulatedYear}: ${description}`);

        await prisma.evolutionHistory.create({
          data: {
            worldId,
            year: currentSimulatedYear,
            eventType: "MUTATION",
            description,
          },
        });
      }

      // Civilization Progression
      const civilization = await prisma.civilization.findUnique({
        where: { speciesId: species.id },
      });

      if (civilization) {
        // Tech advance
        await advanceTechnology(
          civilization.id,
          species.dna.intelligence,
          worldId,
          currentSimulatedYear
        );

        const technology = await prisma.technology.findUnique({
          where: { civilizationId: civilization.id },
        });

        if (technology) {
          await manageResources(civilization.id, technology.level);
        }

        // Planet Colonization / Exploration Chance
        if (Math.random() < 0.15) {
          const planet = await attemptColonization(civilization.id, worldId);
          if (planet) {
            const description = `${species.name} colonized planet "${planet.name}" (${planet.type})`;
            events.push(`Year ${currentSimulatedYear}: ${description}`);
            await prisma.evolutionHistory.create({
              data: {
                worldId,
                year: currentSimulatedYear,
                eventType: "COLONIZATION",
                description,
              }
            });
          }
        }

        // Alliance Chance
        if (Math.random() < 0.02) {
          const otherCivilizations = await prisma.civilization.findMany({
            where: { NOT: { id: civilization.id } },
          });

          if (otherCivilizations.length > 0) {
            const ally = otherCivilizations[Math.floor(Math.random() * otherCivilizations.length)]!;
            await formAlliance(civilization.id, ally.id);
            await prisma.evolutionHistory.create({
              data: {
                worldId,
                year: currentSimulatedYear,
                eventType: "ALLIANCE",
                description: `Alliance formed between ${species.name} and the ${ally.id.slice(0, 5)}`,
              },
            });
          }
        }

        // Trade Chance
        if (Math.random() < 0.03) {
          const traders = await prisma.civilization.findMany({
            where: { NOT: { id: civilization.id } },
          });

          if (traders.length > 0) {
            const buyer = traders[Math.floor(Math.random() * traders.length)]!;
            await createTrade(civilization.id, buyer.id);
            await prisma.evolutionHistory.create({
              data: {
                worldId,
                year: currentSimulatedYear,
                eventType: "TRADE",
                description: `Trade route established between ${civilization.id.slice(0, 5)} and ${buyer.id.slice(0, 5)}`,
              },
            });
          }
        }

        // War Chance
        if (Math.random() < 0.04) {
          const enemyCivilizations = await prisma.civilization.findMany({
            where: { NOT: { id: civilization.id } },
          });

          if (enemyCivilizations.length > 0) {
            const defender = enemyCivilizations[Math.floor(Math.random() * enemyCivilizations.length)]!;
            const diplomacy = await createRelationship(civilization.id, defender.id);
            await updateRelationship(diplomacy.id, "Hostile");

            const warResult = await declareWar(civilization.id, defender.id, currentSimulatedYear);

            const description = `${species.name} won a war against ${defender.id.slice(0, 5)}. Casualties: ${warResult.winnerLoss + warResult.loserLoss}. ${warResult.conquestDescription ?? ""}`;
            events.push(`Year ${currentSimulatedYear}: ${description}`);

            await prisma.evolutionHistory.create({
              data: {
                worldId,
                year: currentSimulatedYear,
                eventType: "WAR",
                description,
              },
            });
          }
        }

        // Peace Treaty Chance
        if (Math.random() < 0.03) {
          const hostileRelations = await prisma.diplomacy.findMany({
            where: { relationship: "Hostile" },
          });

          if (hostileRelations.length > 0) {
            const relation = hostileRelations[Math.floor(Math.random() * hostileRelations.length)]!;
            await createPeaceTreaty(relation.civilizationAId, relation.civilizationBId);
            await prisma.evolutionHistory.create({
              data: {
                worldId,
                year: currentSimulatedYear,
                eventType: "GENERAL",
                description: "Peace treaty signed between hostile factions",
              },
            });
            events.push(`Year ${currentSimulatedYear}: Peace treaty signed`);
          }
        }
      } else {
        // Form new Civilization
        if (species.dna.intelligence >= 5 && currentPopulation >= 150) {
          const createdCivilization = await prisma.civilization.create({
            data: {
              speciesId: species.id,
              stage: "Tribal",
              populationAtFormation: currentPopulation,
            },
          });

          await advanceTechnology(
            createdCivilization.id,
            species.dna.intelligence,
            worldId,
            currentSimulatedYear
          );

          await manageResources(createdCivilization.id, 1);

          const description = `${species.name} formed a Tribal Civilization`;
          events.push(`Year ${currentSimulatedYear}: ${description}`);

          await prisma.evolutionHistory.create({
            data: {
              worldId,
              year: currentSimulatedYear,
              eventType: "CIVILIZATION_FORMED",
              description,
            },
          });
        }
      }
    }

    finalYearsSimulated = year;
  }

  // Update world year
  await prisma.world.update({
    where: { id: worldId },
    data: { currentYear: world.currentYear + finalYearsSimulated },
  });

  // Award Commander XP for completed simulation
  await awardCommanderXp(world.userId, finalYearsSimulated * 10);

  return {
    worldId,
    yearsSimulated: finalYearsSimulated,
    newCurrentYear: world.currentYear + finalYearsSimulated,
    halted: false,
    events,
  };
};

export const getEvolutionHistory = async (worldId: string) => {
  return prisma.evolutionHistory.findMany({
    where: { worldId },
    orderBy: { year: "asc" },
  });
};

// Internal helper to award XP and rank up
const awardCommanderXp = async (userId: string, xpAmount: number) => {
  try {
    const commander = await prisma.commander.findUnique({
      where: { userId }
    });

    if (commander) {
      const newXp = commander.xp + xpAmount;
      let newRank = commander.rank;

      if (newXp >= 12000) newRank = "Legend";
      else if (newXp >= 8000) newRank = "Master";
      else if (newXp >= 5000) newRank = "Diamond";
      else if (newXp >= 3000) newRank = "Platinum";
      else if (newXp >= 1500) newRank = "Gold";
      else if (newXp >= 500) newRank = "Silver";

      await prisma.commander.update({
        where: { id: commander.id },
        data: { xp: newXp, rank: newRank }
      });
    }
  } catch (err) {
    console.error("Failed to award Commander XP:", err);
  }
};