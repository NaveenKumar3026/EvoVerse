"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorldStatistics = void 0;
const prisma_1 = require("../config/prisma");
const getWorldStatistics = async (worldId) => {
    const world = await prisma_1.prisma.world.findUnique({
        where: {
            id: worldId,
        },
    });
    const speciesCount = await prisma_1.prisma.species.count({
        where: {
            worldId,
        },
    });
    const civilizationCount = await prisma_1.prisma.civilization.count();
    const warCount = await prisma_1.prisma.war.count();
    const allianceCount = await prisma_1.prisma.alliance.count();
    const tradeCount = await prisma_1.prisma.trade.count();
    return {
        currentYear: world?.currentYear ?? 0,
        speciesCount,
        civilizationCount,
        warCount,
        allianceCount,
        tradeCount,
    };
};
exports.getWorldStatistics = getWorldStatistics;
