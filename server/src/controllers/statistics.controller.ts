import {
  Request,
  Response,
} from "express";

import {
  getWorldStatistics,
} from "../services/statistics.service";

export const getStatisticsHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const stats =
      await getWorldStatistics(
  req.params.worldId as string
);

    res.json({
      success: true,
      stats,
    });
  };