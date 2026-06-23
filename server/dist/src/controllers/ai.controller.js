"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWorldStoryHandler = void 0;
const ai_service_1 = require("../services/ai.service");
const generateWorldStoryHandler = async (req, res) => {
    try {
        const story = await (0, ai_service_1.generateWorldStory)(req.params.worldId);
        res.json({
            success: true,
            story,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed",
        });
    }
};
exports.generateWorldStoryHandler = generateWorldStoryHandler;
