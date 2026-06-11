import { prisma } from "../config/prisma";

export const generateWorldStory = async (
  worldId: string
) => {

  const history =
    await prisma.evolutionHistory.findMany({
      where: {
        worldId,
      },

      orderBy: {
        year: "asc",
      },
    });

  const timeline =
    history.map((event) => ({
      year: event.year,
      eventType: event.eventType,
      description: event.description,
    }));

 const majorEvents =
  history.filter((event) =>
    event.eventType !== "MUTATION"
  );

  const civilizations =
    await prisma.civilization.findMany({
      include: {
        species: true,
        technology: true,
        resource: true,
      },
    });

  const civilizationSummaries =
    civilizations.map((civilization) => ({
      species:
        civilization.species.name,

      stage:
        civilization.stage,

      technologyEra:
        civilization.technology?.era,

      technologyLevel:
        civilization.technology?.level,

      population:
        civilization.species.population,
    }));

  let story = "";

  for (const event of history) {

    story +=
      `Year ${event.year}: ${event.description}\n`;
  }

  return {
    timeline,
    majorEvents,
    civilizationSummaries,
    story,
  };
};