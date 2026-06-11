import { Router } from "express";

import {
  getCivilizationsHandler,
} from "../controllers/civilization.controller";

const router = Router();

router.get(
  "/",
  getCivilizationsHandler
);

export default router;