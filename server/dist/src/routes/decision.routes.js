"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const decision_controller_1 = require("../controllers/decision.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/pending/:worldId", auth_middleware_1.authenticate, decision_controller_1.getPendingDecisionsHandler);
router.post("/resolve/:decisionId", auth_middleware_1.authenticate, decision_controller_1.resolveDecisionHandler);
exports.default = router;
