import { Router } from "express";

import {
  getTradesHandler,
} from "../controllers/trade.controller";

const router = Router();

router.get(
  "/",
  getTradesHandler
);

export default router;