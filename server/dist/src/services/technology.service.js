"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceTechnology = exports.TECH_TREE = void 0;
const prisma_1 = require("../config/prisma");
exports.TECH_TREE = {
    "Primitive Tools": {
        name: "Primitive Tools",
        era: "Stone Age",
        cost: 5,
        prerequisites: [],
        effects: { productionMultiplier: 1.1, militaryPowerBonus: 15 }
    },
    "Agriculture": {
        name: "Agriculture",
        era: "Bronze Age",
        cost: 15,
        prerequisites: ["Primitive Tools"],
        effects: { productionMultiplier: 1.3 }
    },
    "Industry": {
        name: "Industry",
        era: "Industrial Age",
        cost: 30,
        prerequisites: ["Agriculture"],
        effects: { productionMultiplier: 1.6, militaryPowerBonus: 40 }
    },
    "Electricity": {
        name: "Electricity",
        era: "Digital Age",
        cost: 50,
        prerequisites: ["Industry"],
        effects: { productionMultiplier: 2.0 }
    },
    "Computers": {
        name: "Computers",
        era: "Digital Age",
        cost: 70,
        prerequisites: ["Electricity"],
        effects: { productionMultiplier: 2.5, fleetStrengthBonus: 20 }
    },
    "Space Travel": {
        name: "Space Travel",
        era: "Space Age",
        cost: 90,
        prerequisites: ["Computers"],
        effects: { productionMultiplier: 3.0, fleetStrengthBonus: 50 }
    },
    "Interstellar Travel": {
        name: "Interstellar Travel",
        era: "Interstellar Age",
        cost: 110,
        prerequisites: ["Space Travel"],
        effects: { productionMultiplier: 4.0, fleetStrengthBonus: 100 }
    },
    "Quantum Technology": {
        name: "Quantum Technology",
        era: "Interstellar Age",
        cost: 130,
        prerequisites: ["Interstellar Travel"],
        effects: { productionMultiplier: 5.0, militaryPowerBonus: 150 }
    },
    "Transcendent Technology": {
        name: "Transcendent Technology",
        era: "Transcendent Age",
        cost: 160,
        prerequisites: ["Quantum Technology"],
        effects: { productionMultiplier: 7.0, militaryPowerBonus: 300, fleetStrengthBonus: 250 }
    }
};
const advanceTechnology = async (civilizationId, intelligence, worldId, year) => {
    const civilization = await prisma_1.prisma.civilization.findUnique({
        where: { id: civilizationId },
        include: { technology: true }
    });
    if (!civilization) {
        throw new Error("Civilization not found");
    }
    // Parse currently unlocked technologies
    let unlockedTechs = [];
    try {
        unlockedTechs = JSON.parse(civilization.technologiesJson || "[]");
    }
    catch {
        unlockedTechs = [];
    }
    // Find all researchable technologies (prerequisites met and not already unlocked)
    const researchable = Object.values(exports.TECH_TREE).filter(node => {
        if (unlockedTechs.includes(node.name))
            return false;
        return node.prerequisites.every(prereq => unlockedTechs.includes(prereq));
    });
    if (researchable.length === 0) {
        return civilization.technology;
    }
    // Select one random researchable node to attempt
    const targetNode = researchable[Math.floor(Math.random() * researchable.length)];
    // Success chance is based on intelligence relative to the cost
    const chance = Math.max(0.05, Math.min(0.95, (intelligence / targetNode.cost)));
    if (Math.random() < chance) {
        unlockedTechs.push(targetNode.name);
        // Apply effects
        let milBonus = targetNode.effects.militaryPowerBonus ?? 0;
        let fleetBonus = targetNode.effects.fleetStrengthBonus ?? 0;
        await prisma_1.prisma.civilization.update({
            where: { id: civilizationId },
            data: {
                technologiesJson: JSON.stringify(unlockedTechs),
                militaryPower: { increment: milBonus },
                fleetStrength: { increment: fleetBonus }
            }
        });
        // Sync with legacy Technology model
        let technology = civilization.technology;
        const nextLevel = unlockedTechs.length;
        if (!technology) {
            technology = await prisma_1.prisma.technology.create({
                data: {
                    civilizationId,
                    level: nextLevel,
                    era: targetNode.era
                }
            });
        }
        else {
            technology = await prisma_1.prisma.technology.update({
                where: { id: technology.id },
                data: {
                    level: nextLevel,
                    era: targetNode.era
                }
            });
        }
        // Log history event
        await prisma_1.prisma.evolutionHistory.create({
            data: {
                worldId,
                year,
                eventType: "TECHNOLOGY_ADVANCED",
                description: `${civilizationId} successfully researched "${targetNode.name}" and entered the ${targetNode.era}`
            }
        });
        return technology;
    }
    return civilization.technology;
};
exports.advanceTechnology = advanceTechnology;
