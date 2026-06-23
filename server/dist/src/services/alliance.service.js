"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlliances = exports.formAlliance = void 0;
const prisma_1 = require("../config/prisma");
const formAlliance = async (civilizationAId, civilizationBId) => {
    const existing = await prisma_1.prisma.alliance.findFirst({
        where: {
            OR: [
                {
                    civilizationAId,
                    civilizationBId,
                },
                {
                    civilizationAId: civilizationBId,
                    civilizationBId: civilizationAId,
                },
            ],
        },
    });
    if (existing) {
        return existing;
    }
    return prisma_1.prisma.alliance.create({
        data: {
            civilizationAId,
            civilizationBId,
        },
    });
};
exports.formAlliance = formAlliance;
const getAlliances = async () => {
    return prisma_1.prisma.alliance.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAlliances = getAlliances;
