"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateSpecies = void 0;
const prisma_1 = require("../config/prisma");
const mutation_1 = require("../utils/mutation");
const mutateSpecies = async (speciesId) => {
    const species = await prisma_1.prisma.species.findUnique({
        where: {
            id: speciesId,
        },
        include: {
            dna: true,
        },
    });
    if (!species || !species.dna) {
        throw new Error("Species not found");
    }
    const { trait, change, } = (0, mutation_1.generateMutation)();
    const oldValue = species.dna[trait];
    let newValue = oldValue + change;
    newValue =
        Math.max(1, Math.min(100, newValue));
    await prisma_1.prisma.dNA.update({
        where: {
            id: species.dna.id,
        },
        data: {
            [trait]: newValue,
        },
    });
    const event = await prisma_1.prisma.mutationEvent.create({
        data: {
            trait,
            oldValue,
            newValue,
            change,
            speciesId,
        },
    });
    return event;
};
exports.mutateSpecies = mutateSpecies;
