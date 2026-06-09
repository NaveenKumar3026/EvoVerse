import { Response } from "express";

import { AuthRequest }
from "../middleware/auth.middleware";

import {
  createWorld,
  getUserWorlds
}
from "../services/world.service";

export const createWorldHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const world =
        await createWorld(
          req.body.name,
          req.user.userId
        );

      res.status(201).json({
        success: true,
        world
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create world"
      });
    }
  };

export const getWorldsHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const worlds =
      await getUserWorlds(
        req.user.userId
      );

    res.json({
      success: true,
      worlds
    });
  };