import { prisma } from "../config/prisma";

interface DecisionOption {
  text: string;
  effects: {
    dnaMod?: Record<string, number>;
    resourceMod?: Record<string, number>;
    populationModPercent?: number;
    historyText: string;
  };
}

interface Scenario {
  title: string;
  description: string;
  options: DecisionOption[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "First Alien Contact",
    description: "Your deep space scanners have detected a message from an unlisted star system. How should we reply?",
    options: [
      {
        text: "Send a peaceful greeting of trade and cooperation.",
        effects: {
          dnaMod: { intelligence: 5, adaptability: 5 },
          resourceMod: { energy: 50 },
          historyText: "established peaceful communications with the unknown alien transmission."
        }
      },
      {
        text: "Initiate surveillance protocols and observe from afar.",
        effects: {
          dnaMod: { intelligence: 10 },
          historyText: "chose to silently observe the strange alien broadcast."
        }
      },
      {
        text: "Deploy defense fleets immediately to secure borders.",
        effects: {
          dnaMod: { aggression: 10, strength: 5 },
          resourceMod: { metal: -50 },
          historyText: "mobilized defense fleets in response to the alien encounter."
        }
      }
    ]
  },
  {
    title: "The Great Pandemic",
    description: "A dangerous spaceborne plague has infected multiple species hubs. Public stability is collapsing.",
    options: [
      {
        text: "Enforce a total border quarantine.",
        effects: {
          populationModPercent: -0.15,
          dnaMod: { adaptability: 10 },
          historyText: "quarantined borders to stop the galactic plague, suffering population loss."
        }
      },
      {
        text: "Fund medical cure research using energy reserves.",
        effects: {
          resourceMod: { energy: -100 },
          dnaMod: { intelligence: 10, lifespan: 15 },
          historyText: "successfully synthesized a vaccine for the plague using research grants."
        }
      }
    ]
  },
  {
    title: "Nebula Mineral Discovery",
    description: "An asteroid belt rich in volatile gas and metal ores has been discovered. How do we exploit it?",
    options: [
      {
        text: "Establish massive mining stations.",
        effects: {
          resourceMod: { metal: 200, energy: 50 },
          dnaMod: { aggression: 5 },
          historyText: "mined the rich asteroid belt, boosting industrial capacity."
        }
      },
      {
        text: "Preserve the nebula anomaly for scientific research.",
        effects: {
          dnaMod: { intelligence: 15 },
          historyText: "preserved the nebula anomaly, yielding profound scientific breakthroughs."
        }
      }
    ]
  }
];

export const createPendingDecision = async (worldId: string, year: number) => {
  const existing = await prisma.playerDecision.findFirst({
    where: { worldId, choiceMade: -1 }
  });

  if (existing) {
    return existing;
  }

  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]!;

  return prisma.playerDecision.create({
    data: {
      worldId,
      year,
      title: scenario.title,
      description: scenario.description,
      optionsJson: JSON.stringify(scenario.options),
      choiceMade: -1,
    }
  });
};

export const resolveDecision = async (decisionId: string, choiceIndex: number) => {
  const decision = await prisma.playerDecision.findUnique({
    where: { id: decisionId }
  });

  if (!decision || decision.choiceMade !== -1) {
    throw new Error("Decision not found or already resolved");
  }

  const options: DecisionOption[] = JSON.parse(decision.optionsJson);
  const selectedOption = options[choiceIndex];

  if (!selectedOption) {
    throw new Error("Invalid option selected");
  }

  await prisma.playerDecision.update({
    where: { id: decisionId },
    data: {
      choiceMade: choiceIndex,
      resolvedAt: new Date()
    }
  });

  const civilizations = await prisma.civilization.findMany({
    where: {
      species: { worldId: decision.worldId }
    },
    include: {
      species: {
        include: { dna: true }
      },
      resource: true
    }
  });

  for (const civ of civilizations) {
    if (selectedOption.effects.resourceMod && civ.resource) {
      const metalMod = selectedOption.effects.resourceMod.metal ?? 0;
      const energyMod = selectedOption.effects.resourceMod.energy ?? 0;

      await prisma.resource.update({
        where: { id: civ.resource.id },
        data: {
          metal: Math.max(0, civ.resource.metal + metalMod),
          energy: Math.max(0, civ.resource.energy + energyMod),
        }
      });
    }

    if (selectedOption.effects.dnaMod && civ.species.dna) {
      const strengthMod = selectedOption.effects.dnaMod.strength ?? 0;
      const intelligenceMod = selectedOption.effects.dnaMod.intelligence ?? 0;
      const aggressionMod = selectedOption.effects.dnaMod.aggression ?? 0;
      const adaptabilityMod = selectedOption.effects.dnaMod.adaptability ?? 0;
      const lifespanMod = selectedOption.effects.dnaMod.lifespan ?? 0;

      await prisma.dNA.update({
        where: { id: civ.species.dna.id },
        data: {
          strength: Math.min(100, Math.max(1, civ.species.dna.strength + strengthMod)),
          intelligence: Math.min(100, Math.max(1, civ.species.dna.intelligence + intelligenceMod)),
          aggression: Math.min(100, Math.max(1, civ.species.dna.aggression + aggressionMod)),
          adaptability: Math.min(100, Math.max(1, civ.species.dna.adaptability + adaptabilityMod)),
          lifespan: Math.min(100, Math.max(1, civ.species.dna.lifespan + lifespanMod)),
        }
      });
    }

    if (selectedOption.effects.populationModPercent) {
      const newPop = Math.max(1, Math.floor(civ.species.population * (1 + selectedOption.effects.populationModPercent)));
      await prisma.species.update({
        where: { id: civ.species.id },
        data: { population: newPop }
      });
    }
  }

  await prisma.evolutionHistory.create({
    data: {
      worldId: decision.worldId,
      year: decision.year,
      eventType: "PLAYER_DECISION",
      description: `[Decision: ${decision.title}] Choice: "${selectedOption.text}" was made. Result: ${selectedOption.effects.historyText}`
    }
  });

  return { success: true };
};

export const getPendingDecisions = async (worldId: string) => {
  return prisma.playerDecision.findMany({
    where: { worldId, choiceMade: -1 }
  });
};
