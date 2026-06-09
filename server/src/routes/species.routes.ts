import { Router } from "express";

import {
  createSpeciesHandler,
  getSpeciesHandler,
} from "../controllers/species.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createSpeciesHandler
);

router.get(
  "/world/:worldId",
  authenticate,
  getSpeciesHandler
);

export default router;