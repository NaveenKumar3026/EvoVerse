import { Request, Response } from "express";
import { getCivilizations }
from "../services/civilization.service";

export const getCivilizationsHandler =
  async (
    req: Request,
    res: Response
  ) => {

    const civilizations =
      await getCivilizations();

    res.json({
      success: true,
      civilizations,
    });
  };