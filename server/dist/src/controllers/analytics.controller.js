"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsHandler = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getAnalyticsHandler = async (req, res) => {
    const analytics = await (0, analytics_service_1.getWorldAnalytics)();
    res.json({
        success: true,
        analytics,
    });
};
exports.getAnalyticsHandler = getAnalyticsHandler;
