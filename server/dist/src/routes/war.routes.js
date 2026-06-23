"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const war_controller_1 = require("../controllers/war.controller");
const router = (0, express_1.Router)();
router.get("/", war_controller_1.getWarsHandler);
exports.default = router;
