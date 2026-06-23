"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorldStory = void 0;
const narrative_service_1 = require("../services/narrative.service");
const getWorldStory = async (req, res) => {
    try {
        const worldId = req.params.worldId;
        const story = await (0, narrative_service_1.generateWorldStory)(worldId);
        res.status(200).json(story);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to generate story",
        });
    }
};
exports.getWorldStory = getWorldStory;
