export type WorldStats = {
  currentYear?: number;
  speciesCount?: number;
  civilizationCount?: number;
  warCount?: number;
  allianceCount?: number;
  tradeCount?: number;
};

export type Analytics = {
  strongestCivilization?: string;
  richestCivilization?: string;
  mostAdvancedCivilization?: string;
  largestPopulation?: string;
};

export type AchievementDef = {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: string;
};

export type VictoryType = {
  id: string;
  title: string;
  icon: string;
  color: string;
  leader: string;
  achieved: boolean;
  description: string;
};

export function getGalacticEra(stats: WorldStats | null): string {
  if (!stats) return "Unknown Era";

  const score =
    (stats.tradeCount ?? 0) +
    (stats.allianceCount ?? 0) +
    (stats.warCount ?? 0) +
    (stats.civilizationCount ?? 0) * 5;

  if (score < 5) return "Primitive Age";
  if (score < 15) return "Industrial Age";
  if (score < 30) return "Space Age";
  if (score < 60) return "Interstellar Age";
  if (score < 100) return "Quantum Age";
  return "Transcendent Age";
}

export function getGalaxyStability(stats: WorldStats | null): {
  label: string;
  score: number;
  tone: "stable" | "tense" | "unstable";
} {
  if (!stats) return { label: "Unknown", score: 0, tone: "tense" };

  const wars = stats.warCount ?? 0;
  const alliances = stats.allianceCount ?? 0;
  const civs = Math.max(stats.civilizationCount ?? 1, 1);
  const score = Math.max(
    0,
    Math.min(100, 70 + alliances * 8 - wars * 12 + civs * 2)
  );

  if (score >= 70) return { label: "Stable", score, tone: "stable" };
  if (score >= 40) return { label: "Tense", score, tone: "tense" };
  return { label: "Unstable", score, tone: "unstable" };
}

export function getCivWealth(civ: any): number {
  const r = civ.resource ?? civ.resources ?? {};
  return (
    (r.food ?? 0) +
    (r.wood ?? 0) +
    (r.stone ?? 0) +
    (r.metal ?? 0) +
    (r.energy ?? 0)
  );
}

export function getCivPower(civ: any): number {
  return (
    (civ.species?.population ?? 0) +
    (civ.technology?.level ?? 0) * 100 +
    (civ.militaryPower ?? 0)
  );
}

export function filterWorldCivilizations(
  civilizations: any[],
  worldId: string | null
): any[] {
  if (!worldId) return civilizations;
  return civilizations.filter((c) => c.species?.worldId === worldId);
}

export function findCivByName(
  civilizations: any[],
  name?: string
): any | undefined {
  if (!name) return undefined;
  return civilizations.find((c) => c.species?.name === name);
}

export function computeAchievements(data: {
  civilizations: any[];
  wars: any[];
  alliances: any[];
  analytics: Analytics | null;
  commander: any | null;
  worldId: string | null;
}): AchievementDef[] {
  const civs = filterWorldCivilizations(
    data.civilizations,
    data.worldId
  );
  const worldCivIds = new Set(civs.map((c) => c.id));
  const worldWars = data.wars.filter(
    (w) =>
      worldCivIds.has(w.attackerId) || worldCivIds.has(w.defenderId)
  );
  const worldAlliances = data.alliances.filter(
    (a) =>
      worldCivIds.has(a.civilizationAId) ||
      worldCivIds.has(a.civilizationBId)
  );

  const hasCiv = civs.length > 0;
  const hasWar = worldWars.length > 0;
  const hasAlliance = worldAlliances.length > 0;
  const dominant = data.analytics?.strongestCivilization;
  const richest = data.analytics?.richestCivilization;
  const mostAdvanced = data.analytics?.mostAdvancedCivilization;
  const topTech = civs.reduce(
    (max, c) => Math.max(max, c.technology?.level ?? 0),
    0
  );

  return [
    {
      id: "first-civ",
      title: "First Civilization",
      icon: "🌍",
      description: "Witness the birth of the first galactic empire.",
      unlocked: hasCiv,
      progress: hasCiv ? "Empire emerged" : "Awaiting civilization",
    },
    {
      id: "first-war",
      title: "First War",
      icon: "⚔️",
      description: "Survive or instigate the galaxy's first conflict.",
      unlocked: hasWar,
      progress: hasWar
        ? `${worldWars.length} war(s) recorded`
        : "No wars yet",
    },
    {
      id: "first-alliance",
      title: "First Alliance",
      icon: "🤝",
      description: "Forge the first diplomatic pact between empires.",
      unlocked: hasAlliance,
      progress: hasAlliance
        ? `${worldAlliances.length} alliance(s) formed`
        : "No alliances yet",
    },
    {
      id: "galactic-emperor",
      title: "Galactic Emperor",
      icon: "👑",
      description: "Lead the strongest military empire in the galaxy.",
      unlocked: Boolean(dominant && civs.length >= 2),
      progress: dominant ?? "No dominant power",
    },
    {
      id: "economic-titan",
      title: "Economic Titan",
      icon: "💰",
      description: "Control the wealthiest civilization.",
      unlocked: Boolean(richest && getCivWealth(civs[0] ?? {}) > 0),
      progress: richest ?? "No economic leader",
    },
    {
      id: "technology-pioneer",
      title: "Technology Pioneer",
      icon: "🚀",
      description: "Advance a civilization to the Space Age or beyond.",
      unlocked: topTech >= 5,
      progress:
        topTech >= 5
          ? `${mostAdvanced ?? "Empire"} — Level ${topTech}`
          : `Highest tech: Level ${topTech}`,
    },
  ];
}

export function computeVictories(data: {
  civilizations: any[];
  wars: any[];
  alliances: any[];
  analytics: Analytics | null;
  stats: WorldStats | null;
  worldId: string | null;
}): VictoryType[] {
  const civs = filterWorldCivilizations(
    data.civilizations,
    data.worldId
  );
  const analytics = data.analytics;
  const worldCivIds = new Set(civs.map((c) => c.id));

  const allianceCounts = new Map<string, number>();
  for (const a of data.alliances) {
    if (worldCivIds.has(a.civilizationAId)) {
      allianceCounts.set(
        a.civilizationAId,
        (allianceCounts.get(a.civilizationAId) ?? 0) + 1
      );
    }
    if (worldCivIds.has(a.civilizationBId)) {
      allianceCounts.set(
        a.civilizationBId,
        (allianceCounts.get(a.civilizationBId) ?? 0) + 1
      );
    }
  }

  const diplomaticLeader = [...allianceCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];
  const diplomaticName = diplomaticLeader
    ? civs.find((c) => c.id === diplomaticLeader[0])?.species?.name ??
      "Unknown"
    : "None";

  const militaryLeader = analytics?.strongestCivilization ?? "None";
  const economicLeader = analytics?.richestCivilization ?? "None";
  const techLeader = analytics?.mostAdvancedCivilization ?? "None";

  const topTech = civs.reduce(
    (max, c) => Math.max(max, c.technology?.level ?? 0),
    0
  );
  const topWealth = civs.reduce(
    (max, c) => Math.max(max, getCivWealth(c)),
    0
  );
  const secondWealth = [...civs]
    .map(getCivWealth)
    .sort((a, b) => b - a)[1] ?? 0;

  const militaryAchieved =
    civs.length >= 2 &&
    Boolean(militaryLeader && militaryLeader !== "None");
  const economicAchieved =
    topWealth > 0 && topWealth >= secondWealth * 1.5;
  const techAchieved = topTech >= 6;
  const diplomaticAchieved = (diplomaticLeader?.[1] ?? 0) >= 2;

  const sameLeader =
    militaryLeader === economicLeader &&
    militaryLeader === techLeader &&
    militaryLeader !== "None";
  const dominationAchieved =
    sameLeader && militaryAchieved && economicAchieved && techAchieved;

  return [
    {
      id: "military",
      title: "Military Victory",
      icon: "⚔",
      color: "red",
      leader: militaryLeader,
      achieved: militaryAchieved,
      description: "Dominate through superior military power.",
    },
    {
      id: "economic",
      title: "Economic Victory",
      icon: "💰",
      color: "green",
      leader: economicLeader,
      achieved: economicAchieved,
      description: "Amass overwhelming galactic wealth.",
    },
    {
      id: "technology",
      title: "Technology Victory",
      icon: "🚀",
      color: "purple",
      leader: techLeader,
      achieved: techAchieved,
      description: "Reach advanced technological supremacy.",
    },
    {
      id: "diplomatic",
      title: "Diplomatic Victory",
      icon: "🤝",
      color: "cyan",
      leader: diplomaticName,
      achieved: diplomaticAchieved,
      description: "Unite the galaxy through alliances.",
    },
    {
      id: "domination",
      title: "Galactic Domination",
      icon: "🌌",
      color: "yellow",
      leader: sameLeader ? militaryLeader : "Contested",
      achieved: dominationAchieved,
      description: "Lead in military, economy, and technology simultaneously.",
    },
  ];
}

export function parseStoryChapters(story: string): {
  title: string;
  chapters: { heading: string; body: string }[];
  highlights: string[];
} {
  const lines = story.split("\n");
  let title = "Galactic Chronicle";
  const chapters: { heading: string; body: string }[] = [];
  const highlights: string[] = [];
  let current: { heading: string; body: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      title = trimmed.replace(/^#\s+/, "");
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (current) chapters.push(current);
      current = { heading: trimmed.replace(/^##\s+/, ""), body: "" };
      continue;
    }

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {
      highlights.push(trimmed.replace(/^[-*]\s+/, ""));
    }

    if (current) {
      current.body += (current.body ? "\n" : "") + trimmed;
    }
  }

  if (current) chapters.push(current);

  if (chapters.length === 0 && story.trim()) {
    chapters.push({ heading: "Full Chronicle", body: story.trim() });
  }

  return { title, chapters, highlights };
}

export function civColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
