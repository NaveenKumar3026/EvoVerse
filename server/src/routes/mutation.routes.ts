import { Router }
from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  mutateSpeciesHandler,
} from "../controllers/mutation.controller";

const router = Router();

router.post(
  "/:speciesId",
  authenticate,
  mutateSpeciesHandler
);

export default router;