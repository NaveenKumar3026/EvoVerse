"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorldSpecies = exports.createSpecies = void 0;
const prisma_1 = require("../config/prisma");
const dna_1 = require("../utils/dna");
const createSpecies = async (worldId, name) => {
    const dna = (0, dna_1.generateDNA)();
    const species = await prisma_1.prisma.species.create({
        data: {
            name,
            worldId,
            dna: {
                create: dna,
            },
        },
        include: {
            dna: true,
        },
    });
    return species;
};
exports.createSpecies = createSpecies;
const getWorldSpecies = async (worldId) => {
    return prisma_1.prisma.species.findMany({
        where: {
            worldId,
        },
        include: {
            dna: true,
        },
    });
};
exports.getWorldSpecies = getWorldSpecies;
