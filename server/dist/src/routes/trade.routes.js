"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trade_controller_1 = require("../controllers/trade.controller");
const router = (0, express_1.Router)();
router.get("/", trade_controller_1.getTradesHandler);
exports.default = router;
