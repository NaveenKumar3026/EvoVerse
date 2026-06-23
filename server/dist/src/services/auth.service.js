"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async ({ username, email, password, }) => {
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            commander: {
                create: {
                    name: username,
                    rank: "Bronze",
                    xp: 0,
                    reputation: 100,
                    achievementsJson: "[]"
                }
            }
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const { password: _, ...safeUser } = user;
    return {
        token,
        user: safeUser,
    };
};
exports.loginUser = loginUser;
