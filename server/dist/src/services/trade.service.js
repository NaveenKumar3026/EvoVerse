"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrades = exports.createTrade = void 0;
const prisma_1 = require("../config/prisma");
const createTrade = async (sellerId, buyerId) => {
    return prisma_1.prisma.trade.create({
        data: {
            sellerId,
            buyerId,
            resource: "Food",
            amount: Math.floor(Math.random() * 100) + 1,
        },
    });
};
exports.createTrade = createTrade;
const getTrades = async () => {
    return prisma_1.prisma.trade.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getTrades = getTrades;
