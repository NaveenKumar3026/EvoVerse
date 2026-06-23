import { Router } from "express";
import { getPendingDecisionsHandler, resolveDecisionHandler } from "../controllers/decision.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/pending/:worldId", authenticate, getPendingDecisionsHandler);
router.post("/resolve/:decisionId", authenticate, resolveDecisionHandler);

export default router;
