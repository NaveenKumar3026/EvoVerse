import { prisma } from "../config/prisma";

const eras = [
  "Stone Age",
  "Bronze Age",
  "Iron Age",
  "Medieval Age",
  "Industrial Age",
  "Digital Age",
  "Space Age",
  "Interstellar Age",
];

export const advanceTechnology = async (
  civilizationId: string,
  intelligence: number,
  worldId: string,
  year: number
) => {

  console.log(
    "TECH CALLED",
    civilizationId,
    intelligence
  );

  let technology =
    await prisma.technology.findUnique({
      where: {
        civilizationId,
      },
    });

  console.log(
    "FOUND TECHNOLOGY:",
    technology
  );

  // Create technology if it doesn't exist

  if (!technology) {

    try {

      technology =
        await prisma.technology.create({
          data: {
            civilizationId,
            level: 1,
            era: eras[0],
          },
        });

      console.log(
        "TECH CREATED:",
        technology
      );

      await prisma.evolutionHistory.create({
        data: {
          worldId,
          year,
          description:
            `Technology era started: ${eras[0]}`,
        },
      });

      return technology;

    } catch (error) {

      console.error(
        "TECH CREATE ERROR:",
        error
      );

      throw error;
    }
  }

  // Technology advancement

  const chance =
    intelligence / 100;

  if (Math.random() < chance) {

    const nextLevel =
      Math.min(
        technology.level + 1,
        eras.length
      );

    if (
      nextLevel >
      technology.level
    ) {

      technology =
        await prisma.technology.update({
          where: {
            id: technology.id,
          },

          data: {
            level: nextLevel,
            era: eras[nextLevel - 1],
          },
        });

      console.log(
        "TECH ADVANCED:",
        technology
      );

      await prisma.evolutionHistory.create({
        data: {
          worldId,
          year,
          description:
            `Civilization entered ${eras[nextLevel - 1]}`,
        },
      });
    }
  }

  return technology;
};