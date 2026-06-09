import { prisma } from "../config/prisma";
import { generateMutation } from "../utils/mutation";

export const mutateSpecies = async (
  speciesId: string
) => {

  const species =
    await prisma.species.findUnique({
      where: {
        id: speciesId,
      },

      include: {
        dna: true,
      },
    });

  if (!species || !species.dna) {
    throw new Error(
      "Species not found"
    );
  }

  const {
    trait,
    change,
  } = generateMutation();

  const oldValue =
    species.dna[
      trait
    ] as number;

  let newValue =
    oldValue + change;

  newValue =
    Math.max(
      1,
      Math.min(
        100,
        newValue
      )
    );

  await prisma.dNA.update({
    where: {
      id: species.dna.id,
    },

    data: {
      [trait]: newValue,
    },
  });

  const event =
    await prisma.mutationEvent.create({
      data: {
        trait,

        oldValue,
        newValue,

        change,

        speciesId,
      },
    });

  return event;
};