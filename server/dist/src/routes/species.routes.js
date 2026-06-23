"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const species_controller_1 = require("../controllers/species.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, species_controller_1.createSpeciesHandler);
router.get("/world/:worldId", auth_middleware_1.authenticate, species_controller_1.getSpeciesHandler);
exports.default = router;
