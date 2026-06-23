"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySanctionsHandler = exports.declareRivalryHandler = exports.proposeTreatyHandler = exports.establishEmbassyHandler = exports.getDiplomacyHandler = exports.colonizePlanetHandler = exports.getGalaxyDataHandler = void 0;
const star_service_1 = require("../services/star.service");
const diplomacy_service_1 = require("../services/diplomacy.service");
const getGalaxyDataHandler = async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const galaxy = await (0, star_service_1.getGalaxyData)(worldId);
        res.json({ success: true, galaxy });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch galaxy data" });
    }
};
exports.getGalaxyDataHandler = getGalaxyDataHandler;
const colonizePlanetHandler = async (req, res) => {
    try {
        const planetId = req.params.planetId;
        const { civilizationId } = req.body;
        const planet = await (0, star_service_1.colonizePlanet)(planetId, civilizationId);
        res.json({ success: true, planet });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to colonize planet" });
    }
};
exports.colonizePlanetHandler = colonizePlanetHandler;
const getDiplomacyHandler = async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const relationships = await (0, diplomacy_service_1.getDiplomacyByWorld)(worldId);
        res.json({ success: true, relationships });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch diplomacy data" });
    }
};
exports.getDiplomacyHandler = getDiplomacyHandler;
const establishEmbassyHandler = async (req, res) => {
    try {
        const diplomacyId = req.params.diplomacyId;
        const rel = await (0, diplomacy_service_1.establishEmbassy)(diplomacyId);
        res.json({ success: true, rel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to establish embassy" });
    }
};
exports.establishEmbassyHandler = establishEmbassyHandler;
const proposeTreatyHandler = async (req, res) => {
    try {
        const diplomacyId = req.params.diplomacyId;
        const { treatyType } = req.body;
        const rel = await (0, diplomacy_service_1.proposeTreaty)(diplomacyId, treatyType);
        res.json({ success: true, rel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to propose treaty" });
    }
};
exports.proposeTreatyHandler = proposeTreatyHandler;
const declareRivalryHandler = async (req, res) => {
    try {
        const diplomacyId = req.params.diplomacyId;
        const { enabled } = req.body;
        const rel = await (0, diplomacy_service_1.declareRivalry)(diplomacyId, Boolean(enabled));
        res.json({ success: true, rel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to declare rivalry" });
    }
};
exports.declareRivalryHandler = declareRivalryHandler;
const applySanctionsHandler = async (req, res) => {
    try {
        const diplomacyId = req.params.diplomacyId;
        const { enabled } = req.body;
        const rel = await (0, diplomacy_service_1.applySanctions)(diplomacyId, Boolean(enabled));
        res.json({ success: true, rel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to apply sanctions" });
    }
};
exports.applySanctionsHandler = applySanctionsHandler;
