import { prisma } from "../config/prisma";

export const getWorldAnalytics =
  async () => {

    const civilizations =
      await prisma.civilization.findMany({
        include: {
          species: true,
          technology: true,
          resource: true,
        },
      });

    if (
      civilizations.length === 0
    ) {
      return null;
    }

    const strongestCivilization =
      [...civilizations].sort(
        (a, b) =>
          (
            (b.species.population ?? 0) +
            (b.technology?.level ?? 0) * 100
          ) -
          (
            (a.species.population ?? 0) +
            (a.technology?.level ?? 0) * 100
          )
      )[0];

    const richestCivilization =
      [...civilizations].sort(
        (a, b) =>
          (
            (b.resource?.food ?? 0) +
            (b.resource?.wood ?? 0) +
            (b.resource?.stone ?? 0) +
            (b.resource?.metal ?? 0) +
            (b.resource?.energy ?? 0)
          ) -
          (
            (a.resource?.food ?? 0) +
            (a.resource?.wood ?? 0) +
            (a.resource?.stone ?? 0) +
            (a.resource?.metal ?? 0) +
            (a.resource?.energy ?? 0)
          )
      )[0];

    const mostAdvancedCivilization =
      [...civilizations].sort(
        (a, b) =>
          (b.technology?.level ?? 0) -
          (a.technology?.level ?? 0)
      )[0];

    const largestPopulation =
      [...civilizations].sort(
        (a, b) =>
          b.species.population -
          a.species.population
      )[0];

    return {
      strongestCivilization:
        strongestCivilization.species.name,

      richestCivilization:
        richestCivilization.species.name,

      mostAdvancedCivilization:
        mostAdvancedCivilization.species.name,

      largestPopulation:
        largestPopulation.species.name,
    };
  };