import { prisma } from "../config/prisma";

const disasters = [
  {
    type: "Meteor Strike",
    populationLoss: 0.50,
  },

  {
    type: "Volcanic Eruption",
    populationLoss: 0.25,
  },

  {
    type: "Pandemic",
    populationLoss: 0.40,
  },

  {
    type: "Ice Age",
    populationLoss: 0.15,
  },
];

export const triggerDisaster = async (
  worldId: string,
  speciesId: string,
  population: number,
  year: number
) => {

  const disaster =
    disasters[
      Math.floor(
        Math.random() *
        disasters.length
      )
    ];

  const loss =
    Math.floor(
      population *
      disaster.populationLoss
    );

  const remainingPopulation =
    Math.max(
      1,
      population - loss
    );

  await prisma.species.update({
    where: {
      id: speciesId,
    },

    data: {
      population:
        remainingPopulation,
    },
  });

  const description =
    `${disaster.type} killed ${loss} population`;

  await prisma.disasterEvent.create({
    data: {
      type:
        disaster.type,

      severity:
        Math.floor(
          disaster.populationLoss *
          100
        ),

      description,

      worldId,
    },
  });

  await prisma.evolutionHistory.create({
    data: {
      worldId,
      year,
      description,
    },
  });

  return {
    disaster:
      disaster.type,

    loss,

    remainingPopulation,
  };
};