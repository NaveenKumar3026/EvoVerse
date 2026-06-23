"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWarsHandler = void 0;
const war_service_1 = require("../services/war.service");
const getWarsHandler = async (req, res) => {
    const wars = await (0, war_service_1.getWars)();
    res.json({
        success: true,
        wars,
    });
};
exports.getWarsHandler = getWarsHandler;
