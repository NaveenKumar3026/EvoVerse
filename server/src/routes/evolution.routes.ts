import { Router }
from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  runEvolutionHandler,
} from "../controllers/evolution.controller";

const router = Router();

router.post(
  "/run/:worldId",
  authenticate,
  runEvolutionHandler
);

export default router;