import { Request, Response } from "express";

import {
  createSpecies,
  getWorldSpecies,
} from "../services/species.service";

export const createSpeciesHandler =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const species =
        await createSpecies(
          req.body.worldId,
          req.body.name
        );

      res.status(201).json({
        success: true,
        species,
      });
    } catch {
      res.status(500).json({
        success: false,
        message:
          "Failed to create species",
      });
    }
  };

export const getSpeciesHandler =
  async (
    req: Request,
    res: Response
  ) => {
    const worldId = req.params.worldId as string;

const species =
  await getWorldSpecies(worldId);

    res.json({
      success: true,
      species,
    });
  };