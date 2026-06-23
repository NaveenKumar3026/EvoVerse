"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const story_controller_1 = require("../controllers/story.controller");
const router = (0, express_1.Router)();
router.get("/:worldId", story_controller_1.getWorldStory);
exports.default = router;
