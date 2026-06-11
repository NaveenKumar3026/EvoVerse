import { Router }
from "express";

import {
  getWorldStory,
}
from "../controllers/story.controller";

const router = Router();

router.get(
  "/:worldId",
  getWorldStory
);

export default router;