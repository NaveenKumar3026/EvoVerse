"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDecisionHandler = exports.getPendingDecisionsHandler = void 0;
const decision_service_1 = require("../services/decision.service");
const getPendingDecisionsHandler = async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const decisions = await (0, decision_service_1.getPendingDecisions)(worldId);
        res.json({ success: true, decisions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch pending decisions" });
    }
};
exports.getPendingDecisionsHandler = getPendingDecisionsHandler;
const resolveDecisionHandler = async (req, res) => {
    try {
        const decisionId = req.params.decisionId;
        const { choiceIndex } = req.body;
        await (0, decision_service_1.resolveDecision)(decisionId, Number(choiceIndex));
        res.json({ success: true, message: "Decision resolved successfully" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to resolve decision"
        });
    }
};
exports.resolveDecisionHandler = resolveDecisionHandler;
