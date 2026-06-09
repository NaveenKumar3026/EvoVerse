import {
  Request,
  Response,
} from "express";

import {
  mutateSpecies,
} from "../services/mutation.service";

export const mutateSpeciesHandler =
  async (
    req: Request,
    res: Response
  ) => {
    try {

        const speciesId =
  req.params.speciesId as string;

const event =
  await mutateSpecies(speciesId);

      res.json({
        success: true,
        event,
      });

    } catch (
      error
    ) {

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Mutation failed",
      });

    }
  };