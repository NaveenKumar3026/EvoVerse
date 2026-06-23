"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradesHandler = void 0;
const trade_service_1 = require("../services/trade.service");
const getTradesHandler = async (req, res) => {
    const trades = await (0, trade_service_1.getTrades)();
    res.json({
        success: true,
        trades,
    });
};
exports.getTradesHandler = getTradesHandler;
