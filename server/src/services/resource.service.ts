import { prisma } from "../config/prisma";

export const manageResources = async (
  civilizationId: string,
  technologyLevel: number
) => {

  let resource =
    await prisma.resource.findUnique({
      where: {
        civilizationId,
      },
    });

  // Create starting resources

  if (!resource) {

    resource =
      await prisma.resource.create({
        data: {
          civilizationId,

          food: 100,
          wood: 100,
          stone: 100,
          metal: 100,
          energy: 100,
        },
      });

    return resource;
  }

  // Production based on technology

  const foodGain =
    10 + technologyLevel * 5;

  const woodGain =
    5 + technologyLevel * 3;

  const stoneGain =
    5 + technologyLevel * 3;

  const metalGain =
    technologyLevel * 4;

  const energyGain =
    technologyLevel * 6;

  resource =
    await prisma.resource.update({
      where: {
        id: resource.id,
      },

      data: {
        food:
          resource.food + foodGain,

        wood:
          resource.wood + woodGain,

        stone:
          resource.stone + stoneGain,

        metal:
          resource.metal + metalGain,

        energy:
          resource.energy + energyGain,
      },
    });

  return resource;
};