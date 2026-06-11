import { prisma } from "../config/prisma";

export const createTrade =
  async (
    sellerId: string,
    buyerId: string
  ) => {

    return prisma.trade.create({
      data: {
        sellerId,
        buyerId,

        resource:
          "Food",

        amount:
          Math.floor(
            Math.random() * 100
          ) + 1,
      },
    });
  };

  export const getTrades =
  async () => {

    return prisma.trade.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  };