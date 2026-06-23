"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const evolution_controller_1 = require("../controllers/evolution.controller");
const router = (0, express_1.Router)();
router.get("/history/:worldId", auth_middleware_1.authenticate, evolution_controller_1.getHistoryHandler);
router.post("/run/:worldId", auth_middleware_1.authenticate, evolution_controller_1.runEvolutionHandler);
exports.default = router;
