"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWarsByWorld = exports.getWars = exports.declareWar = exports.calculateMilitaryPower = void 0;
const prisma_1 = require("../config/prisma");
const calculateMilitaryPower = async (civilizationId) => {
    const civilization = await prisma_1.prisma.civilization.findUnique({
        where: { id: civilizationId },
        include: {
            species: true,
            technology: true,
            resource: true,
        },
    });
    if (!civilization) {
        return 0;
    }
    const population = civilization.species.population;
    const techLevel = civilization.technology?.level ?? 0;
    const metal = civilization.resource?.metal ?? 0;
    const energy = civilization.resource?.energy ?? 0;
    return (population +
        techLevel * 120 +
        metal +
        energy +
        civilization.militaryPower +
        civilization.fleetStrength * 10);
};
exports.calculateMilitaryPower = calculateMilitaryPower;
const declareWar = async (attackerId, defenderId, year) => {
    const attacker = await prisma_1.prisma.civilization.findUnique({
        where: { id: attackerId },
        include: { species: true }
    });
    const defender = await prisma_1.prisma.civilization.findUnique({
        where: { id: defenderId },
        include: { species: true }
    });
    if (!attacker || !defender) {
        throw new Error("Civilizations not found");
    }
    const attackerPower = await (0, exports.calculateMilitaryPower)(attackerId);
    const defenderPower = await (0, exports.calculateMilitaryPower)(defenderId);
    const totalPower = attackerPower + defenderPower;
    const attackerChance = totalPower > 0 ? (attackerPower / totalPower) : 0.5;
    const attackerWon = Math.random() < attackerChance;
    const winnerId = attackerWon ? attackerId : defenderId;
    const loserId = attackerWon ? defenderId : attackerId;
    const winner = attackerWon ? attacker : defender;
    const loser = attackerWon ? defender : attacker;
    const winnerLoss = Math.floor(winner.species.population * 0.08);
    const loserLoss = Math.floor(loser.species.population * 0.22);
    await prisma_1.prisma.species.update({
        where: { id: winner.species.id },
        data: {
            population: Math.max(1, winner.species.population - winnerLoss),
        },
    });
    await prisma_1.prisma.species.update({
        where: { id: loser.species.id },
        data: {
            population: Math.max(1, loser.species.population - loserLoss),
        },
    });
    // Conquest Mechanics
    let conquestPlanetId = null;
    let conquestDescription = "";
    if (attackerWon) {
        const defenderPlanets = await prisma_1.prisma.planet.findMany({
            where: { ownerId: defenderId }
        });
        if (defenderPlanets.length > 0) {
            const conqueredPlanet = defenderPlanets[Math.floor(Math.random() * defenderPlanets.length)];
            conquestPlanetId = conqueredPlanet.id;
            await prisma_1.prisma.planet.update({
                where: { id: conqueredPlanet.id },
                data: { ownerId: attackerId }
            });
            conquestDescription = `Conquered the planet "${conqueredPlanet.name}".`;
        }
    }
    const war = await prisma_1.prisma.war.create({
        data: {
            attackerId,
            defenderId,
            winner: winnerId,
            year,
            status: "Resolved",
            conquestPlanetId,
        },
    });
    return {
        winner,
        winnerLoss,
        loserLoss,
        conquestDescription,
        attackerPower,
        defenderPower,
        attackerChance,
    };
};
exports.declareWar = declareWar;
const getWars = async () => {
    return prisma_1.prisma.war.findMany({
        orderBy: {
            year: "desc",
        },
    });
};
exports.getWars = getWars;
const getWarsByWorld = async (worldId) => {
    const civilizations = await prisma_1.prisma.civilization.findMany({
        where: {
            species: {
                worldId: worldId
            }
        }
    });
    const civIds = civilizations.map(c => c.id);
    return prisma_1.prisma.war.findMany({
        where: {
            OR: [
                { attackerId: { in: civIds } },
                { defenderId: { in: civIds } }
            ]
        },
        orderBy: {
            year: "desc"
        }
    });
};
exports.getWarsByWorld = getWarsByWorld;
