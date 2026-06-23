"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiplomacyByWorld = exports.applySanctions = exports.declareRivalry = exports.proposeTreaty = exports.establishEmbassy = exports.updateRelationship = exports.createRelationship = void 0;
const prisma_1 = require("../config/prisma");
const createRelationship = async (civilizationAId, civilizationBId) => {
    const existing = await prisma_1.prisma.diplomacy.findFirst({
        where: {
            OR: [
                { civilizationAId, civilizationBId },
                { civilizationAId: civilizationBId, civilizationBId: civilizationAId }
            ]
        },
    });
    if (existing) {
        return existing;
    }
    return prisma_1.prisma.diplomacy.create({
        data: {
            civilizationAId,
            civilizationBId,
            relationship: "Neutral",
            treatyType: "None",
            embassy: false,
            rivalry: false,
            sanctions: false,
        },
    });
};
exports.createRelationship = createRelationship;
const updateRelationship = async (diplomacyId, relationship) => {
    return prisma_1.prisma.diplomacy.update({
        where: { id: diplomacyId },
        data: { relationship },
    });
};
exports.updateRelationship = updateRelationship;
const establishEmbassy = async (diplomacyId) => {
    return prisma_1.prisma.diplomacy.update({
        where: { id: diplomacyId },
        data: { embassy: true }
    });
};
exports.establishEmbassy = establishEmbassy;
const proposeTreaty = async (diplomacyId, treatyType) => {
    let relationship = "Neutral";
    if (treatyType === "Alliance" || treatyType === "NonAggression" || treatyType === "Trade") {
        relationship = "Friendly";
    }
    return prisma_1.prisma.diplomacy.update({
        where: { id: diplomacyId },
        data: { treatyType, relationship }
    });
};
exports.proposeTreaty = proposeTreaty;
const declareRivalry = async (diplomacyId, enabled) => {
    return prisma_1.prisma.diplomacy.update({
        where: { id: diplomacyId },
        data: {
            rivalry: enabled,
            relationship: enabled ? "Hostile" : "Neutral",
            treatyType: enabled ? "None" : undefined
        }
    });
};
exports.declareRivalry = declareRivalry;
const applySanctions = async (diplomacyId, enabled) => {
    return prisma_1.prisma.diplomacy.update({
        where: { id: diplomacyId },
        data: { sanctions: enabled }
    });
};
exports.applySanctions = applySanctions;
const getDiplomacyByWorld = async (worldId) => {
    const civilizations = await prisma_1.prisma.civilization.findMany({
        where: {
            species: {
                worldId: worldId
            }
        }
    });
    const civIds = civilizations.map(c => c.id);
    return prisma_1.prisma.diplomacy.findMany({
        where: {
            civilizationAId: { in: civIds },
            civilizationBId: { in: civIds }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
};
exports.getDiplomacyByWorld = getDiplomacyByWorld;
