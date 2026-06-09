import { prisma } from "../config/prisma";

const planetTypes = [
  "Temperate",
  "Desert",
  "Frozen",
  "Oceanic",
  "Volcanic"
];

export const createWorld = async (
  name: string,
  userId: string
) => {
  const planetType =
    planetTypes[
      Math.floor(
        Math.random() * planetTypes.length
      )
    ];

  const world = await prisma.world.create({
    data: {
      name,

      planetType,

      temperature:
        Math.floor(Math.random() * 60) - 10,

      waterLevel:
        Math.floor(Math.random() * 100),

      oxygenLevel:
        Math.floor(Math.random() * 50) + 10,

      userId
    }
  });

  return world;
};

export const getUserWorlds = async (
  userId: string
) => {
  return prisma.world.findMany({
    where: {
      userId
    }
  });
};