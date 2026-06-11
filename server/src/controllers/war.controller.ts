import {
  Request,
  Response,
} from "express";

import {
  getWars,
} from "../services/war.service";

export const getWarsHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const wars =
      await getWars();

    res.json({
      success: true,
      wars,
    });

  };