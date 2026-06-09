import {
  Request,
  Response,
} from "express";

import {
  runEvolution,
  getEvolutionHistory,
} from "../services/evolution.service";

export const getHistoryHandler =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const history =
        await getEvolutionHistory(
          req.params.worldId as string
        );

      res.json({
        success: true,
        history,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load history",
      });

    }

  };

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