import { prisma } from "../config/prisma";
import { generateDNA } from "../utils/dna";

export const createSpecies = async (
  worldId: string,
  name: string
) => {
  const dna = generateDNA();

  const species = await prisma.species.create({
    data: {
      name,
      worldId,

      dna: {
        create: dna,
      },
    },

    include: {
      dna: true,
    },
  });

  return species;
};

export const getWorldSpecies = async (
  worldId: string
) => {
  return prisma.species.findMany({
    where: {
      worldId,
    },

    include: {
      dna: true,
    },
  });
};