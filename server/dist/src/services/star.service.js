"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colonizePlanet = exports.getGalaxyData = exports.generateGalaxyForWorld = void 0;
const prisma_1 = require("../config/prisma");
const starNames = [
    "Alpha Centauri", "Sirius", "Vega", "Betelgeuse", "Polaris",
    "Arcturus", "Aldebaran", "Rigel", "Proxima", "Capella"
];
const planetTypes = [
    "Temperate", "Desert", "Frozen", "Oceanic", "Volcanic", "Gas Giant"
];
const generateGalaxyForWorld = async (worldId) => {
    const systemsData = [];
    // Create 6 unique star systems arranged in a galactic cluster coordinates
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * 2 * Math.PI;
        const distance = 150 + Math.random() * 80;
        const x = Math.floor(50 + (Math.cos(angle) * distance * 0.45 + 50));
        const y = Math.floor(50 + (Math.sin(angle) * distance * 0.45 + 50));
        const name = starNames[i] ?? `Sector-${i}`;
        systemsData.push({ name, x, y });
    }
    for (const sys of systemsData) {
        const starSystem = await prisma_1.prisma.starSystem.create({
            data: {
                name: sys.name,
                x: sys.x,
                y: sys.y,
                worldId,
            }
        });
        // Generate 2-3 planets per system
        const numPlanets = Math.floor(Math.random() * 2) + 2;
        for (let p = 1; p <= numPlanets; p++) {
            const type = planetTypes[Math.floor(Math.random() * planetTypes.length)] || "Temperate";
            const metalRichness = Math.floor(Math.random() * 80) + 20;
            const energyRichness = Math.floor(Math.random() * 80) + 20;
            await prisma_1.prisma.planet.create({
                data: {
                    name: `${sys.name} ${getRomanNumeral(p)}`,
                    type,
                    resources: JSON.stringify({ metal: metalRichness, energy: energyRichness }),
                    starSystemId: starSystem.id
                }
            });
        }
    }
};
exports.generateGalaxyForWorld = generateGalaxyForWorld;
function getRomanNumeral(num) {
    if (num === 1)
        return "I";
    if (num === 2)
        return "II";
    if (num === 3)
        return "III";
    return "IV";
}
const getGalaxyData = async (worldId) => {
    return prisma_1.prisma.starSystem.findMany({
        where: { worldId },
        include: {
            planets: {
                include: {
                    owner: {
                        include: {
                            species: true
                        }
                    }
                }
            }
        }
    });
};
exports.getGalaxyData = getGalaxyData;
const colonizePlanet = async (planetId, civilizationId) => {
    return prisma_1.prisma.planet.update({
        where: { id: planetId },
        data: { ownerId: civilizationId }
    });
};
exports.colonizePlanet = colonizePlanet;
