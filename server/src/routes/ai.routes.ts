import { Router } from "express";
import { generateWorldStoryHandler }
  from "../controllers/ai.controller";

const router = Router();

router.get(
  "/story/:worldId",
  generateWorldStoryHandler
);

export default router;