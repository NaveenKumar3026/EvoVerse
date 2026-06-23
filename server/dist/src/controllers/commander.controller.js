"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommanderProfile = void 0;
const prisma_1 = require("../config/prisma");
const getCommanderProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        let commander = await prisma_1.prisma.commander.findUnique({
            where: { userId }
        });
        if (!commander) {
            const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            commander = await prisma_1.prisma.commander.create({
                data: {
                    name: user?.username ?? "Unknown Commander",
                    userId,
                    rank: "Bronze",
                    xp: 0,
                    reputation: 100,
                    achievementsJson: "[]"
                }
            });
        }
        res.json({
            success: true,
            commander
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load commander profile"
        });
    }
};
exports.getCommanderProfile = getCommanderProfile;
