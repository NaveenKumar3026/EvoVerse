"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commander_controller_1 = require("../controllers/commander.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/profile", auth_middleware_1.authenticate, commander_controller_1.getCommanderProfile);
exports.default = router;
