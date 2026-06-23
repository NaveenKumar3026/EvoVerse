"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const civilization_controller_1 = require("../controllers/civilization.controller");
const router = (0, express_1.Router)();
router.get("/", civilization_controller_1.getCivilizationsHandler);
exports.default = router;
