import { Request, Response } from "express";
import { generateWorldStory }
from "../services/narrative.service";

export const getWorldStory =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const worldId =
  req.params.worldId as string;

const story =
  await generateWorldStory(
    worldId
  );

      res.status(200).json(story);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to generate story",
      });
    }
  };