"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMutation = void 0;
const traits = [
    "strength",
    "intelligence",
    "speed",
    "adaptability",
    "aggression",
    "lifespan",
];
const generateMutation = () => {
    const trait = traits[Math.floor(Math.random() * traits.length)];
    const change = Math.floor(Math.random() * 21) - 10;
    return {
        trait,
        change,
    };
};
exports.generateMutation = generateMutation;
