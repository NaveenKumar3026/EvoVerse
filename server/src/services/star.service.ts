import { prisma } from "../config/prisma";

const starNames = [
  "Alpha Centauri", "Sirius", "Vega", "Betelgeuse", "Polaris",
  "Arcturus", "Aldebaran", "Rigel", "Proxima", "Capella"
];

const planetTypes = [
  "Temperate", "Desert", "Frozen", "Oceanic", "Volcanic", "Gas Giant"
];

export const generateGalaxyForWorld = async (worldId: string) => {
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
    const starSystem = await prisma.starSystem.create({
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
      
      await prisma.planet.create({
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

function getRomanNumeral(num: number): string {
  if (num === 1) return "I";
  if (num === 2) return "II";
  if (num === 3) return "III";
  return "IV";
}

export const getGalaxyData = async (worldId: string) => {
  return prisma.starSystem.findMany({
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

export const colonizePlanet = async (planetId: string, civilizationId: string) => {
  return prisma.planet.update({
    where: { id: planetId },
    data: { ownerId: civilizationId }
  });
};
