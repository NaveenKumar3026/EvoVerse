"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alliance_controller_1 = require("../controllers/alliance.controller");
const router = (0, express_1.Router)();
router.get("/", alliance_controller_1.getAlliancesHandler);
exports.default = router;
