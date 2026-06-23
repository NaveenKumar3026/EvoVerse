"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorldsHandler = exports.createWorldHandler = void 0;
const world_service_1 = require("../services/world.service");
const createWorldHandler = async (req, res) => {
    try {
        const world = await (0, world_service_1.createWorld)(req.body.name, req.user.userId);
        res.status(201).json({
            success: true,
            world
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create world"
        });
    }
};
exports.createWorldHandler = createWorldHandler;
const getWorldsHandler = async (req, res) => {
    const worlds = await (0, world_service_1.getUserWorlds)(req.user.userId);
    res.json({
        success: true,
        worlds
    });
};
exports.getWorldsHandler = getWorldsHandler;
