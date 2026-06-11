import {
  Request,
  Response,
} from "express";

import {
  getAlliances,
} from "../services/alliance.service";

export const getAlliancesHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const alliances =
      await getAlliances();

    res.json({
      success: true,
      alliances,
    });

  };