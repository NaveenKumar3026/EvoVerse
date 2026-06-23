"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDNA = void 0;
const generateDNA = () => {
    return {
        strength: Math.floor(Math.random() * 100) + 1,
        intelligence: Math.floor(Math.random() * 100) + 1,
        speed: Math.floor(Math.random() * 100) + 1,
        adaptability: Math.floor(Math.random() * 100) + 1,
        aggression: Math.floor(Math.random() * 100) + 1,
        lifespan: Math.floor(Math.random() * 100) + 1,
    };
};
exports.generateDNA = generateDNA;
