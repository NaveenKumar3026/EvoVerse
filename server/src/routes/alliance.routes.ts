import { Router } from "express";

import {
  getAlliancesHandler,
} from "../controllers/alliance.controller";

const router = Router();

router.get(
  "/",
  getAlliancesHandler
);

export default router;