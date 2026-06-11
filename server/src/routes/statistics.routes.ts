import { Router } from "express";

import {
  getStatisticsHandler,
} from "../controllers/statistics.controller";

const router = Router();

router.get(
  "/:worldId",
  getStatisticsHandler
);

export default router;