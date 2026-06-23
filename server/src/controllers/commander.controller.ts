import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../config/prisma";

export const getCommanderProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    
    let commander = await prisma.commander.findUnique({
      where: { userId }
    });

    if (!commander) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      commander = await prisma.commander.create({
        data: {
          name: user?.username ?? "Unknown Commander",
          userId,
          rank: "Bronze",
          xp: 0,
          reputation: 100,
          achievementsJson: "[]"
        }
      });
    }

    res.json({
      success: true,
      commander
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load commander profile"
    });
  }
};
