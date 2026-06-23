import { Router } from "express";
import { getGalaxyDataHandler, colonizePlanetHandler } from "../controllers/star.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/galaxy/:worldId", authenticate, getGalaxyDataHandler);
router.post("/colonize/:planetId", authenticate, colonizePlanetHandler);

export default router;
