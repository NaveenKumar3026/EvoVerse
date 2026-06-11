import { prisma } from "../config/prisma";
import { mutateSpecies } from "./mutation.service";
import { triggerDisaster } from "./disaster.service";
import { advanceTechnology } from "./technology.service";
import { manageResources }
from "./resource.service";
import { declareWar } from "./war.service";
import {
  createRelationship,
  updateRelationship,
} from "./diplomacy.service";
import { formAlliance }
from "./alliance.service";
import { createTrade }
from "./trade.service";
import { createPeaceTreaty }
from "./peace.service";

export const runEvolution = async (
  worldId: string,
  years: number
) => {

  const events: string[] = [];

  const world =
    await prisma.world.findUnique({
      where: {
        id: worldId,
      },

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

  for (
    const species of world.species
  ) {

    if (!species.dna) continue;

    let currentPopulation =
      species.population;

    for (
      let year = 1;
      year <= years;
      year++
    ) {

      // -------------------------
      // Population Growth
      // -------------------------

      const growth =
        species.dna.adaptability / 20 +
        species.dna.intelligence / 40 -
        species.dna.aggression / 30;

      currentPopulation =
        Math.max(
          1,
          Math.floor(
            currentPopulation + growth
          )
        );

      await prisma.species.update({
        where: {
          id: species.id,
        },

        data: {
          population:
            currentPopulation,
        },
      });

      // -------------------------
      // Disaster Chance
      // -------------------------

      if (
        Math.random() <
        world.disasterFrequency / 100
      ) {

        const disaster =
          await triggerDisaster(
            worldId,
            species.id,
            currentPopulation,
            world.currentYear + year
          );

        currentPopulation =
          disaster.remainingPopulation;

        events.push(
          `Year ${year}: ${disaster.disaster} killed ${disaster.loss} population`
        );
      }

      // -------------------------
      // Mutation Chance
      // -------------------------

      if (
        Math.random() < 0.30
      ) {

        const mutation =
          await mutateSpecies(
            species.id
          );

        const description =
          `${species.name} mutated in ${mutation.trait}`;

        events.push(
          `Year ${year}: ${description}`
        );

        await prisma.evolutionHistory.create({
  data: {
    worldId,
    year:
      world.currentYear + year,
    eventType: "MUTATION",
    description,
  },
});
      }

      // -------------------------
      // Civilization Progression
      // -------------------------

      const civilization =
        await prisma.civilization.findUnique({
          where: {
            speciesId:
              species.id,
          },
        });

     if (civilization) {

  await advanceTechnology(
    civilization.id,
    species.dna.intelligence,
    worldId,
    world.currentYear + year
  );

  const technology =
    await prisma.technology.findUnique({
      where: {
        civilizationId:
          civilization.id,
      },
    });

  if (technology) {

    await manageResources(
      civilization.id,
      technology.level
    );
  }

  // -------------------------
// Alliance Chance
// -------------------------

if (
  Math.random() < 0.02
) {

  const otherCivilizations =
    await prisma.civilization.findMany({
      where: {
        NOT: {
          id: civilization.id,
        },
      },
    });

  if (
    otherCivilizations.length > 0
  ) {

    const ally =
      otherCivilizations[
        Math.floor(
          Math.random() *
          otherCivilizations.length
        )
      ];

    await formAlliance(
      civilization.id,
      ally.id
    );

    await prisma.evolutionHistory.create({
      data: {
        worldId,
        year:
          world.currentYear + year,

        eventType:
          "ALLIANCE",

        description:
          "Alliance formed",
      },
    });
  }
}

// -------------------------
// Trade Chance
// -------------------------

if (
  Math.random() < 0.03
) {

  const traders =
    await prisma.civilization.findMany({
      where: {
        NOT: {
          id: civilization.id,
        },
      },
    });

  if (
    traders.length > 0
  ) {

    const buyer =
      traders[
        Math.floor(
          Math.random() *
          traders.length
        )
      ];


      console.log(
  "TRADE ATTEMPT",
  civilization.id
);
    await createTrade(
      civilization.id,
      buyer.id
    );

    console.log(
  "TRADE CREATED"
);
    await prisma.evolutionHistory.create({
      data: {
        worldId,
        year:
          world.currentYear + year,

        eventType:
          "TRADE",

        description:
          "Trade agreement established",
      },
    });
  }
}

  // -------------------------
  // War Chance
  // -------------------------

  if (
    Math.random() < 0.05
  ) {

    const enemyCivilizations =
      await prisma.civilization.findMany({
        where: {
          NOT: {
            id: civilization.id,
          },
        },
      });

    if (
      enemyCivilizations.length > 0
    ) {

      const defender =
        enemyCivilizations[
          Math.floor(
            Math.random() *
            enemyCivilizations.length
          )
        ];

      const diplomacy =
  await createRelationship(
    civilization.id,
    defender.id
  );

  await updateRelationship(
  diplomacy.id,
  "Hostile"
);

      const war =
        await declareWar(
          civilization.id,
          defender.id,
          world.currentYear + year
        );

        

      const winnerCivilization =
        await prisma.civilization.findUnique({
          where: {
            id: war.winner,
          },

          include: {
            species: true,
          },
        });

     const description =
  `${winnerCivilization?.species.name} won a war. ` +
  `Casualties: Winner ${war.winnerLoss}, Loser ${war.loserLoss}`;

        events.push(
  `Year ${year}: Relationship became Hostile`
);

      events.push(
        `Year ${year}: ${description}`
      );

      await prisma.evolutionHistory.create({
  data: {
    worldId,
    year:
      world.currentYear + year,
    eventType: "WAR",
    description,
  },
});
    }
  }

  // -------------------------
// Peace Treaty Chance
// -------------------------

if (
  Math.random() < 0.03
) {

  const hostileRelations =
  await prisma.diplomacy.findMany({
    where: {
      relationship: "Hostile",
    },
  });

  if (
    hostileRelations.length > 0
  ) {

    const relation =
      hostileRelations[
        Math.floor(
          Math.random() *
          hostileRelations.length
        )
      ];

    await createPeaceTreaty(
      relation.civilizationAId,
      relation.civilizationBId
    );

    await prisma.evolutionHistory.create({
      data: {
        worldId,
        year:
          world.currentYear + year,

        eventType:
          "GENERAL",

        description:
          "Peace treaty signed",
      },
    });

    events.push(
      `Year ${year}: Peace treaty signed`
    );
  }
}
}

      if (!civilization) {

        if (
          species.dna.intelligence >= 5 &&
          currentPopulation >= 150
        ) {

          const createdCivilization =
  await prisma.civilization.create({
    data: {
      speciesId:
        species.id,

      stage:
        "Tribal",

      populationAtFormation:
        currentPopulation,
    },
  });

await advanceTechnology(
  createdCivilization.id,
  species.dna.intelligence,
  worldId,
  world.currentYear + year
);

await manageResources(
  createdCivilization.id,
  1
);

          const description =
            `${species.name} formed a Tribal Civilization`;

          events.push(
            `Year ${year}: ${description}`
          );

          await prisma.evolutionHistory.create({
  data: {
    worldId,
    year:
      world.currentYear + year,
    eventType: "CIVILIZATION_FORMED",
    description,
  },
});
        }
      }
      else {

        let nextStage:
          string | null =
          null;

        if (
          civilization.stage ===
            "Tribal" &&
          species.dna.intelligence >= 40 &&
          currentPopulation >= 500
        ) {
          nextStage =
            "Village";
        }

        else if (
          civilization.stage ===
            "Village" &&
          species.dna.intelligence >= 60 &&
          currentPopulation >= 1000
        ) {
          nextStage =
            "Kingdom";
        }

        else if (
          civilization.stage ===
            "Kingdom" &&
          species.dna.intelligence >= 75 &&
          currentPopulation >= 2500
        ) {
          nextStage =
            "Empire";
        }

        else if (
          civilization.stage ===
            "Empire" &&
          species.dna.intelligence >= 90 &&
          currentPopulation >= 5000
        ) {
          nextStage =
            "Advanced Civilization";
        }

        if (nextStage) {

  await prisma.civilization.update({
    where: {
      id:
        civilization.id,
    },

    data: {
      stage:
        nextStage,
    },
  });

  await advanceTechnology(
    civilization.id,
    species.dna.intelligence,
    worldId,
    world.currentYear + year
  );

  const description =
    `${species.name} advanced to ${nextStage}`;

          events.push(
            `Year ${year}: ${description}`
          );

          await prisma.evolutionHistory.create({
  data: {
    worldId,
    year:
      world.currentYear + year,
    eventType: "CIVILIZATION_ADVANCED",
    description,
  },
});
        }
      }
    }
  }

  await prisma.world.update({
    where: {
      id: worldId,
    },

    data: {
      currentYear:
        world.currentYear + years,
    },
  });

  return {
    worldId,
    yearsSimulated: years,

    newCurrentYear:
      world.currentYear + years,

    events,
  };
};

export const getEvolutionHistory =
  async (
    worldId: string
  ) => {

    return prisma.evolutionHistory.findMany({
      where: {
        worldId,
      },

      orderBy: {
        year: "asc",
      },
    });

  };