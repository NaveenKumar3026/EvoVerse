import axios from "axios";
import { prisma } from "../config/prisma";

export const generateWorldStory = async (worldId: string) => {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: {
      species: {
        include: {
          civilization: {
            include: {
              technology: true,
              resource: true,
            }
          }
        }
      },
      history: {
        orderBy: { year: "asc" }
      }
    }
  });

  if (!world) {
    throw new Error("World not found");
  }

  // Construct a summary of what happened
  const timelineSummary = world.history
    .map(h => `Year ${h.year} [${h.eventType}]: ${h.description}`)
    .join("\n");

  const speciesSummary = world.species
    .map(s => {
      const civ = s.civilization;
      return `- Species "${s.name}" (Pop: ${s.population}). Civilization Stage: ${civ?.stage ?? "None"}. Tech Era: ${civ?.technology?.era ?? "None"}.`;
    })
    .join("\n");

  const prompt = `
  You are the AI Galactic Historian 2.0. Write a structured Chronicle Book of the galaxy "${world.name}".
  The world is currently in year ${world.currentYear} (${world.currentEra} Era).

  Here is the background of the species and civilizations in this galaxy:
  ${speciesSummary}

  Here is the timeline of events that occurred:
  ${timelineSummary}

  Format the output as a beautiful markdown book. Use the following structure:
  # Chronicles of ${world.name}
  
  ## Chapter 1: The Dawn of Life
  (Describe the origin of the species and their early struggles)

  ## Chapter 2: The Rise of Civilizations
  (Describe how the species built tribal communities and advanced their technologies)

  ## Chapter 3: Great Epochs and Alliances
  (Describe the wars, trade routes, and diplomatic treaties that shaped the galaxy)

  ## Chapter 4: The Current Era (${world.currentEra})
  (Summarize the state of the galaxy, the dominant power, and the future horizon)
  `;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false,
    }, { timeout: 8000 }); // 8 second timeout to fail fast and fallback

    if (response.data && response.data.response) {
      return response.data.response;
    }
  } catch (error) {
    console.warn("Ollama AI offline or failed. Using procedural fallback generator.", error);
  }

  // Fallback procedural book generation
  return generateProceduralStory(world);
};

function generateProceduralStory(world: any): string {
  const name = world.name;
  const year = world.currentYear;
  const era = world.currentEra;
  
  const speciesNames = world.species.map((s: any) => s.name).join(", ") || "various organisms";
  
  // Group events
  const wars = world.history.filter((h: any) => h.eventType === "WAR");
  const alliances = world.history.filter((h: any) => h.eventType === "ALLIANCE");
  const techAdvances = world.history.filter((h: any) => h.eventType === "TECHNOLOGY_ADVANCED");
  const disasters = world.history.filter((h: any) => h.eventType === "DISASTER");

  let story = `# Chronicles of ${name}\n\n`;
  
  story += `## Chapter 1: The Dawn of Life\n`;
  story += `In the early epochs of galaxy ${name}, a spark of life emerged. Among the stardust, the primordial species of ${speciesNames} evolved, developing basic DNA configurations of strength, intelligence, and adaptability. These primitive species roamed the planet, surviving mutations and environmental disasters.\n\n`;

  story += `## Chapter 2: The Rise of Civilizations\n`;
  if (techAdvances.length > 0) {
    story += `As intelligence sparked, civilizations began to form. Tech advancements were documented across the galaxy: ${techAdvances.slice(0, 3).map((t: any) => t.description).join(", ")}. What started as simple tribal tools soon laid the foundations for complex kingdoms and spacefaring empires.\n\n`;
  } else {
    story += `Though life was primitive, the species developed community bonds. They forged basic tribal structures and began researching primitive tools, eyeing the heavens with curiosity.\n\n`;
  }

  story += `## Chapter 3: Great Epochs and Interactions\n`;
  if (wars.length > 0 || alliances.length > 0) {
    story += `The timeline records great conflicts and treaties. The fires of conflict burned during the wars, notably: ${wars.slice(0, 2).map((w: any) => w.description).join(", ")}. In contrast, hope was restored through alliances and trades: ${alliances.slice(0, 2).map((a: any) => a.description).join(", ")}. These actions forged the modern borders of galactic empires.\n\n`;
  } else {
    story += `As borders touched, trade routes were established. Through peaceful exchange of resources, the civilizations entered a prosperous age, avoiding major galactic conflicts for centuries.\n\n`;
  }

  if (disasters.length > 0) {
    story += `*Historical Note on Cataclysms:* The galaxy was tested by severe cataclysms, including: ${disasters.slice(0, 2).map((d: any) => d.description).join(", ")}, which shook the civilizations to their core.\n\n`;
  }

  story += `## Chapter 4: The Current Era (${era})\n`;
  story += `Today, in Year ${year}, the galaxy ${name} rests in the ${era} Era. The species continue their endless exploration of the stars, unlocking new technologies, and shaping the destiny of the universe. What lies ahead is a blank canvas, waiting for the next commander to write history.\n`;

  return story;
}