import { Router } from "express";
import { getCommanderProfile } from "../controllers/commander.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authenticate, getCommanderProfile);

export default router;
