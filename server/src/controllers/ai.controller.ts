import { Request, Response }
  from "express";

import {
  generateWorldStory,
}
from "../services/ai.service";

export const generateWorldStoryHandler =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const story =
        await generateWorldStory(
          req.params.worldId as string
        );

      res.json({
        success: true,
        story,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed",
      });

    }
  };