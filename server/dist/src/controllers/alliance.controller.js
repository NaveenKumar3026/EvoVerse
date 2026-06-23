"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlliancesHandler = void 0;
const alliance_service_1 = require("../services/alliance.service");
const getAlliancesHandler = async (req, res) => {
    const alliances = await (0, alliance_service_1.getAlliances)();
    res.json({
        success: true,
        alliances,
    });
};
exports.getAlliancesHandler = getAlliancesHandler;
