import { Router } from "express";

import {
  createWorldHandler,
  getWorldsHandler
}
from "../controllers/world.controller";

import {
  authenticate
}
from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createWorldHandler
);

router.get(
  "/",
  authenticate,
  getWorldsHandler
);

export default router;