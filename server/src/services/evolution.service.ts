import { prisma } from "../config/prisma";
import { mutateSpecies } from "./mutation.service";

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
    let year = 1;
    year <= years;
    year++
  ) {

    for (
      const species of world.species
    ) {

      if (!species.dna) continue;

      const growth =
        species.dna.adaptability / 20 +
        species.dna.intelligence / 40 -
        species.dna.aggression / 30;

      const newPopulation =
        Math.max(
          1,
          Math.floor(
            species.population + growth
          )
        );

      await prisma.species.update({
        where: {
          id: species.id,
        },

        data: {
          population:
            newPopulation,
        },
      });

      if (
        Math.random() < 0.30
      ) {

        const mutation =
          await mutateSpecies(
            species.id
          );

        events.push(
          `Year ${year}: ${species.name} mutation in ${mutation.trait}`
        );
      }

      if (
        species.dna.intelligence > 70 &&
        Math.random() <
          species.dna.intelligence /
            1000
      ) {

        const exists =
          await prisma.civilization.findUnique({
            where: {
              speciesId:
                species.id,
            },
          });

        if (!exists) {

          await prisma.civilization.create({
            data: {
              speciesId:
                species.id,

              stage:
                "Tribal",
            },
          });

          events.push(
            `Year ${year}: ${species.name} formed a civilization`
          );
        }
      }
    }
  }

  return events;
};
