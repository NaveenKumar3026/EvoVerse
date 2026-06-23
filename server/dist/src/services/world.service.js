"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWorlds = exports.createWorld = void 0;
const prisma_1 = require("../config/prisma");
const star_service_1 = require("./star.service");
const planetTypes = [
    "Temperate",
    "Desert",
    "Frozen",
    "Oceanic",
    "Volcanic"
];
const createWorld = async (name, userId) => {
    const planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
    const world = await prisma_1.prisma.world.create({
        data: {
            name,
            planetType,
            temperature: Math.floor(Math.random() * 60) - 10,
            waterLevel: Math.floor(Math.random() * 100),
            oxygenLevel: Math.floor(Math.random() * 50) + 10,
            userId
        }
    });
    // Generate galaxy for this world
    await (0, star_service_1.generateGalaxyForWorld)(world.id);
    return world;
};
exports.createWorld = createWorld;
const getUserWorlds = async (userId) => {
    return prisma_1.prisma.world.findMany({
        where: {
            userId
        }
    });
};
exports.getUserWorlds = getUserWorlds;
