"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const world_controller_1 = require("../controllers/world.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, world_controller_1.createWorldHandler);
router.get("/", auth_middleware_1.authenticate, world_controller_1.getWorldsHandler);
exports.default = router;
