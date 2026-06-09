import {
  Request,
  Response,
} from "express";

import {
  runEvolution,
} from "../services/evolution.service";

export const runEvolutionHandler =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const events =
        await runEvolution(
          req.params.worldId as string,
          req.body.years
        );

      res.json({
        success: true,
        events,
      });

    } catch (
      error
    ) {

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Simulation failed",
      });

    }
  };