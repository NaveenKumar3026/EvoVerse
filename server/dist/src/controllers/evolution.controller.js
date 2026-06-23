"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEvolutionHandler = exports.getHistoryHandler = void 0;
const evolution_service_1 = require("../services/evolution.service");
const getHistoryHandler = async (req, res) => {
    try {
        const history = await (0, evolution_service_1.getEvolutionHistory)(req.params.worldId);
        res.json({
            success: true,
            history,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to load history",
        });
    }
};
exports.getHistoryHandler = getHistoryHandler;
const runEvolutionHandler = async (req, res) => {
    try {
        const events = await (0, evolution_service_1.runEvolution)(req.params.worldId, req.body.years);
        res.json({
            success: true,
            events,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Simulation failed",
        });
    }
};
exports.runEvolutionHandler = runEvolutionHandler;
