"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvolutionHistory = exports.runEvolution = void 0;
const prisma_1 = require("../config/prisma");
const mutation_service_1 = require("./mutation.service");
const disaster_service_1 = require("./disaster.service");
const technology_service_1 = require("./technology.service");
const resource_service_1 = require("./resource.service");
const war_service_1 = require("./war.service");
const diplomacy_service_1 = require("./diplomacy.service");
const alliance_service_1 = require("./alliance.service");
const trade_service_1 = require("./trade.service");
const peace_service_1 = require("./peace.service");
const decision_service_1 = require("./decision.service");
const attemptColonization = async (civilizationId, worldId) => {
    const civilization = await prisma_1.prisma.civilization.findUnique({
        where: { id: civilizationId }
    });
    if (!civilization)
        return null;
    let techs = [];
    try {
        techs = JSON.parse(civilization.technologiesJson || "[]");
    }
    catch {
        techs = [];
    }
    // Check if they have space travel
    if (!techs.includes("Space Travel") && !techs.includes("Interstellar Travel")) {
        return null;
    }
    // Find uncolonized planet
    const uncolonizedPlanet = await prisma_1.prisma.planet.findFirst({
        where: {
            ownerId: null,
            starSystem: {
                worldId: worldId
            }
        }
    });
    if (uncolonizedPlanet) {
        await prisma_1.prisma.planet.update({
            where: { id: uncolonizedPlanet.id },
            data: { ownerId: civilizationId }
        });
        await prisma_1.prisma.civilization.update({
            where: { id: civilizationId },
            data: {
                fleetStrength: { increment: 5 },
                militaryPower: { increment: 50 }
            }
        });
        return uncolonizedPlanet;
    }
    return null;
};
const runEvolution = async (worldId, years) => {
    const events = [];
    const world = await prisma_1.prisma.world.findUnique({
        where: { id: worldId },
        include: {
            species: {
                include: {
                    dna: true,
                },
            },
        },
    });
    if (!world) {
        throw new Error("World not found");
    }
    // 1. Check for existing pending decision
    const pendingDecision = await prisma_1.prisma.playerDecision.findFirst({
        where: { worldId, choiceMade: -1 }
    });
    if (pendingDecision) {
        return {
            worldId,
            yearsSimulated: 0,
            halted: true,
            pendingDecision,
            events: ["Simulation halted. A critical decision requires commander input."]
        };
    }
    let finalYearsSimulated = 0;
    for (let year = 1; year <= years; year++) {
        const currentSimulatedYear = world.currentYear + year;
        // 2. Halt check: Every 30 years, trigger an interactive decision
        if (currentSimulatedYear > 0 && currentSimulatedYear % 30 === 0) {
            const decision = await (0, decision_service_1.createPendingDecision)(worldId, currentSimulatedYear);
            // Save progress up to this year
            await prisma_1.prisma.world.update({
                where: { id: worldId },
                data: { currentYear: currentSimulatedYear },
            });
            // Award partial Commander XP
            await awardCommanderXp(world.userId, year * 10);
            events.push(`Year ${currentSimulatedYear}: Critical Galactic Event triggered. Simulation paused for decision.`);
            return {
                worldId,
                yearsSimulated: year,
                newCurrentYear: currentSimulatedYear,
                halted: true,
                pendingDecision: decision,
                events,
            };
        }
        // Run normal year simulation loops for each species
        for (const species of world.species) {
            if (!species.dna)
                continue;
            let currentPopulation = species.population;
            // Population Growth
            const growth = species.dna.adaptability / 20 +
                species.dna.intelligence / 40 -
                species.dna.aggression / 30;
            currentPopulation = Math.max(1, Math.floor(currentPopulation + growth));
            await prisma_1.prisma.species.update({
                where: { id: species.id },
                data: { population: currentPopulation },
            });
            // Disaster Chance
            if (Math.random() < world.disasterFrequency / 100) {
                const disaster = await (0, disaster_service_1.triggerDisaster)(worldId, species.id, currentPopulation, currentSimulatedYear);
                currentPopulation = disaster.remainingPopulation;
                events.push(`Year ${currentSimulatedYear}: ${disaster.disaster} killed ${disaster.loss} population on ${species.name}`);
            }
            // Mutation Chance
            if (Math.random() < 0.20) {
                const mutation = await (0, mutation_service_1.mutateSpecies)(species.id);
                const description = `${species.name} mutated in ${mutation.trait}`;
                events.push(`Year ${currentSimulatedYear}: ${description}`);
                await prisma_1.prisma.evolutionHistory.create({
                    data: {
                        worldId,
                        year: currentSimulatedYear,
                        eventType: "MUTATION",
                        description,
                    },
                });
            }
            // Civilization Progression
            const civilization = await prisma_1.prisma.civilization.findUnique({
                where: { speciesId: species.id },
            });
            if (civilization) {
                // Tech advance
                await (0, technology_service_1.advanceTechnology)(civilization.id, species.dna.intelligence, worldId, currentSimulatedYear);
                const technology = await prisma_1.prisma.technology.findUnique({
                    where: { civilizationId: civilization.id },
                });
                if (technology) {
                    await (0, resource_service_1.manageResources)(civilization.id, technology.level);
                }
                // Planet Colonization / Exploration Chance
                if (Math.random() < 0.15) {
                    const planet = await attemptColonization(civilization.id, worldId);
                    if (planet) {
                        const description = `${species.name} colonized planet "${planet.name}" (${planet.type})`;
                        events.push(`Year ${currentSimulatedYear}: ${description}`);
                        await prisma_1.prisma.evolutionHistory.create({
                            data: {
                                worldId,
                                year: currentSimulatedYear,
                                eventType: "COLONIZATION",
                                description,
                            }
                        });
                    }
                }
                // Alliance Chance
                if (Math.random() < 0.02) {
                    const otherCivilizations = await prisma_1.prisma.civilization.findMany({
                        where: { NOT: { id: civilization.id } },
                    });
                    if (otherCivilizations.length > 0) {
                        const ally = otherCivilizations[Math.floor(Math.random() * otherCivilizations.length)];
                        await (0, alliance_service_1.formAlliance)(civilization.id, ally.id);
                        await prisma_1.prisma.evolutionHistory.create({
                            data: {
                                worldId,
                                year: currentSimulatedYear,
                                eventType: "ALLIANCE",
                                description: `Alliance formed between ${species.name} and the ${ally.id.slice(0, 5)}`,
                            },
                        });
                    }
                }
                // Trade Chance
                if (Math.random() < 0.03) {
                    const traders = await prisma_1.prisma.civilization.findMany({
                        where: { NOT: { id: civilization.id } },
                    });
                    if (traders.length > 0) {
                        const buyer = traders[Math.floor(Math.random() * traders.length)];
                        await (0, trade_service_1.createTrade)(civilization.id, buyer.id);
                        await prisma_1.prisma.evolutionHistory.create({
                            data: {
                                worldId,
                                year: currentSimulatedYear,
                                eventType: "TRADE",
                                description: `Trade route established between ${civilization.id.slice(0, 5)} and ${buyer.id.slice(0, 5)}`,
                            },
                        });
                    }
                }
                // War Chance
                if (Math.random() < 0.04) {
                    const enemyCivilizations = await prisma_1.prisma.civilization.findMany({
                        where: { NOT: { id: civilization.id } },
                    });
                    if (enemyCivilizations.length > 0) {
                        const defender = enemyCivilizations[Math.floor(Math.random() * enemyCivilizations.length)];
                        const diplomacy = await (0, diplomacy_service_1.createRelationship)(civilization.id, defender.id);
                        await (0, diplomacy_service_1.updateRelationship)(diplomacy.id, "Hostile");
                        const warResult = await (0, war_service_1.declareWar)(civilization.id, defender.id, currentSimulatedYear);
                        const description = `${species.name} won a war against ${defender.id.slice(0, 5)}. Casualties: ${warResult.winnerLoss + warResult.loserLoss}. ${warResult.conquestDescription ?? ""}`;
                        events.push(`Year ${currentSimulatedYear}: ${description}`);
                        await prisma_1.prisma.evolutionHistory.create({
                            data: {
                                worldId,
                                year: currentSimulatedYear,
                                eventType: "WAR",
                                description,
                            },
                        });
                    }
                }
                // Peace Treaty Chance
                if (Math.random() < 0.03) {
                    const hostileRelations = await prisma_1.prisma.diplomacy.findMany({
                        where: { relationship: "Hostile" },
                    });
                    if (hostileRelations.length > 0) {
                        const relation = hostileRelations[Math.floor(Math.random() * hostileRelations.length)];
                        await (0, peace_service_1.createPeaceTreaty)(relation.civilizationAId, relation.civilizationBId);
                        await prisma_1.prisma.evolutionHistory.create({
                            data: {
                                worldId,
                                year: currentSimulatedYear,
                                eventType: "GENERAL",
                                description: "Peace treaty signed between hostile factions",
                            },
                        });
                        events.push(`Year ${currentSimulatedYear}: Peace treaty signed`);
                    }
                }
            }
            else {
                // Form new Civilization
                if (species.dna.intelligence >= 5 && currentPopulation >= 150) {
                    const createdCivilization = await prisma_1.prisma.civilization.create({
                        data: {
                            speciesId: species.id,
                            stage: "Tribal",
                            populationAtFormation: currentPopulation,
                        },
                    });
                    await (0, technology_service_1.advanceTechnology)(createdCivilization.id, species.dna.intelligence, worldId, currentSimulatedYear);
                    await (0, resource_service_1.manageResources)(createdCivilization.id, 1);
                    const description = `${species.name} formed a Tribal Civilization`;
                    events.push(`Year ${currentSimulatedYear}: ${description}`);
                    await prisma_1.prisma.evolutionHistory.create({
                        data: {
                            worldId,
                            year: currentSimulatedYear,
                            eventType: "CIVILIZATION_FORMED",
                            description,
                        },
                    });
                }
            }
        }
        finalYearsSimulated = year;
    }
    // Update world year
    await prisma_1.prisma.world.update({
        where: { id: worldId },
        data: { currentYear: world.currentYear + finalYearsSimulated },
    });
    // Award Commander XP for completed simulation
    await awardCommanderXp(world.userId, finalYearsSimulated * 10);
    return {
        worldId,
        yearsSimulated: finalYearsSimulated,
        newCurrentYear: world.currentYear + finalYearsSimulated,
        halted: false,
        events,
    };
};
exports.runEvolution = runEvolution;
const getEvolutionHistory = async (worldId) => {
    return prisma_1.prisma.evolutionHistory.findMany({
        where: { worldId },
        orderBy: { year: "asc" },
    });
};
exports.getEvolutionHistory = getEvolutionHistory;
// Internal helper to award XP and rank up
const awardCommanderXp = async (userId, xpAmount) => {
    try {
        const commander = await prisma_1.prisma.commander.findUnique({
            where: { userId }
        });
        if (commander) {
            const newXp = commander.xp + xpAmount;
            let newRank = commander.rank;
            if (newXp >= 12000)
                newRank = "Legend";
            else if (newXp >= 8000)
                newRank = "Master";
            else if (newXp >= 5000)
                newRank = "Diamond";
            else if (newXp >= 3000)
                newRank = "Platinum";
            else if (newXp >= 1500)
                newRank = "Gold";
            else if (newXp >= 500)
                newRank = "Silver";
            await prisma_1.prisma.commander.update({
                where: { id: commander.id },
                data: { xp: newXp, rank: newRank }
            });
        }
    }
    catch (err) {
        console.error("Failed to award Commander XP:", err);
    }
};
