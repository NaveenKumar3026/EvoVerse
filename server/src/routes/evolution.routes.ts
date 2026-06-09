import { Router }
from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  runEvolutionHandler,
  getHistoryHandler,
} from "../controllers/evolution.controller";

const router = Router();

router.get(
  "/history/:worldId",
  authenticate,
  getHistoryHandler
);

router.post(
  "/run/:worldId",
  authenticate,
  runEvolutionHandler
);

export default router;