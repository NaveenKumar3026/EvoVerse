import {
  Request,
  Response,
} from "express";

import {
  getTrades,
} from "../services/trade.service";

export const getTradesHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const trades =
      await getTrades();

    res.json({
      success: true,
      trades,
    });

  };