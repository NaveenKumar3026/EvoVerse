"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatisticsHandler = void 0;
const statistics_service_1 = require("../services/statistics.service");
const getStatisticsHandler = async (req, res) => {
    const stats = await (0, statistics_service_1.getWorldStatistics)(req.params.worldId);
    res.json({
        success: true,
        stats,
    });
};
exports.getStatisticsHandler = getStatisticsHandler;
