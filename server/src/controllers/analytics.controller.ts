import {
  Request,
  Response,
} from "express";

import {
  getWorldAnalytics,
} from "../services/analytics.service";

export const getAnalyticsHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const analytics =
      await getWorldAnalytics();

    res.json({
      success: true,
      analytics,
    });

  };