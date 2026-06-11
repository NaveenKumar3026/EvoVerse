import { prisma } from "../config/prisma";

export const getCivilizations =
  async () => {

    return prisma.civilization.findMany({
      include: {
        species: true,
        technology: true,
        resource: true,
      },
    });
  };