"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCivilizations = void 0;
const prisma_1 = require("../config/prisma");
const getCivilizations = async () => {
    return prisma_1.prisma.civilization.findMany({
        include: {
            species: true,
            technology: true,
            resource: true,
        },
    });
};
exports.getCivilizations = getCivilizations;
