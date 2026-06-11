import { Router } from "express";

import {
  getWarsHandler,
} from "../controllers/war.controller";

const router = Router();

router.get(
  "/",
  getWarsHandler
);

export default router;