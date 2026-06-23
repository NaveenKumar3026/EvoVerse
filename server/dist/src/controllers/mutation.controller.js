"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateSpeciesHandler = void 0;
const mutation_service_1 = require("../services/mutation.service");
const mutateSpeciesHandler = async (req, res) => {
    try {
        const speciesId = req.params.speciesId;
        const event = await (0, mutation_service_1.mutateSpecies)(speciesId);
        res.json({
            success: true,
            event,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Mutation failed",
        });
    }
};
exports.mutateSpeciesHandler = mutateSpeciesHandler;
