"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpeciesHandler = exports.createSpeciesHandler = void 0;
const species_service_1 = require("../services/species.service");
const createSpeciesHandler = async (req, res) => {
    try {
        const species = await (0, species_service_1.createSpecies)(req.body.worldId, req.body.name);
        res.status(201).json({
            success: true,
            species,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to create species",
        });
    }
};
exports.createSpeciesHandler = createSpeciesHandler;
const getSpeciesHandler = async (req, res) => {
    const worldId = req.params.worldId;
    const species = await (0, species_service_1.getWorldSpecies)(worldId);
    res.json({
        success: true,
        species,
    });
};
exports.getSpeciesHandler = getSpeciesHandler;
