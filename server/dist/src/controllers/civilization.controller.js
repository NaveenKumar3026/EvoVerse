"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCivilizationsHandler = void 0;
const civilization_service_1 = require("../services/civilization.service");
const getCivilizationsHandler = async (req, res) => {
    const civilizations = await (0, civilization_service_1.getCivilizations)();
    res.json({
        success: true,
        civilizations,
    });
};
exports.getCivilizationsHandler = getCivilizationsHandler;
