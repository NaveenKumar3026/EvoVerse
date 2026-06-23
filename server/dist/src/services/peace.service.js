"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPeaceTreaty = void 0;
const prisma_1 = require("../config/prisma");
const createPeaceTreaty = async (civilizationAId, civilizationBId) => {
    return prisma_1.prisma.diplomacy.updateMany({
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
        data: {
            relationship: "Neutral",
        },
    });
};
exports.createPeaceTreaty = createPeaceTreaty;
