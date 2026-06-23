"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const star_controller_1 = require("../controllers/star.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/galaxy/:worldId", auth_middleware_1.authenticate, star_controller_1.getGalaxyDataHandler);
router.post("/colonize/:planetId", auth_middleware_1.authenticate, star_controller_1.colonizePlanetHandler);
exports.default = router;
