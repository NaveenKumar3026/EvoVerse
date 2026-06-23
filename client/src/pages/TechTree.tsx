import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";
import { filterWorldCivilizations } from "../utils/gameCalculations";

interface TechNode {
  name: string;
  era: string;
  cost: number;
  prerequisites: string[];
  effects: {
    productionMultiplier?: number;
    militaryPowerBonus?: number;
    fleetStrengthBonus?: number;
  };
}

const TECH_TREE_NODES: TechNode[] = [
  { name: "Primitive Tools", era: "Stone Age", cost: 5, prerequisites: [], effects: { productionMultiplier: 1.1, militaryPowerBonus: 15 } },
  { name: "Agriculture", era: "Bronze Age", cost: 15, prerequisites: ["Primitive Tools"], effects: { productionMultiplier: 1.3 } },
  { name: "Industry", era: "Industrial Age", cost: 30, prerequisites: ["Agriculture"], effects: { productionMultiplier: 1.6, militaryPowerBonus: 40 } },
  { name: "Electricity", era: "Digital Age", cost: 50, prerequisites: ["Industry"], effects: { productionMultiplier: 2.0 } },
  { name: "Computers", era: "Digital Age", cost: 70, prerequisites: ["Electricity"], effects: { productionMultiplier: 2.5, fleetStrengthBonus: 20 } },
  { name: "Space Travel", era: "Space Age", cost: 90, prerequisites: ["Computers"], effects: { productionMultiplier: 3.0, fleetStrengthBonus: 50 } },
  { name: "Interstellar Travel", era: "Interstellar Age", cost: 110, prerequisites: ["Space Travel"], effects: { productionMultiplier: 4.0, fleetStrengthBonus: 100 } },
  { name: "Quantum Technology", era: "Interstellar Age", cost: 130, prerequisites: ["Interstellar Travel"], effects: { productionMultiplier: 5.0, militaryPowerBonus: 150 } },
  { name: "Transcendent Technology", era: "Transcendent Age", cost: 160, prerequisites: ["Quantum Technology"], effects: { productionMultiplier: 7.0, militaryPowerBonus: 300, fleetStrengthBonus: 250 } },
];

export default function TechTree() {
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [selectedCivId, setSelectedCivId] = useState<string>("");
  const [unlockedTechs, setUnlockedTechs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    const fetchCivs = async () => {
      try {
        const res = await api.get("/civilizations");
        const worldCivs = filterWorldCivilizations(
          res.data.civilizations ?? [],
          worldId
        );
        setCivilizations(worldCivs);
        if (worldCivs.length > 0) {
          setSelectedCivId(worldCivs[0].id);
          try {
            setUnlockedTechs(
              JSON.parse(worldCivs[0].technologiesJson || "[]")
            );
          } catch {
            setUnlockedTechs([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCivs();
  }, [worldId]);

  const handleCivChange = (civId: string) => {
    setSelectedCivId(civId);
    const civ = civilizations.find((c) => c.id === civId);
    if (civ) {
      try {
        setUnlockedTechs(JSON.parse(civ.technologiesJson || "[]"));
      } catch {
        setUnlockedTechs([]);
      }
    }
  };

  const getStatus = (node: TechNode) => {
    if (unlockedTechs.includes(node.name)) return "UNLOCKED";
    const reqsMet = node.prerequisites.every((req) =>
      unlockedTechs.includes(req)
    );
    return reqsMet ? "RESEARCHABLE" : "LOCKED";
  };

  const selectedCiv = civilizations.find((c) => c.id === selectedCivId);
  const unlockedCount = TECH_TREE_NODES.filter(
    (n) => getStatus(n) === "UNLOCKED"
  ).length;
  const progress = Math.round(
    (unlockedCount / TECH_TREE_NODES.length) * 100
  );

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Loading Research Matrix..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
            Research Division
          </p>
          <h1 className="text-4xl font-black text-cyan-400 tracking-wide">
            Technology Tree
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            Civilization research progression
          </p>
        </div>

        {civilizations.length > 0 && (
          <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase text-slate-400">Empire:</span>
              <select
                value={selectedCivId}
                onChange={(e) => handleCivChange(e.target.value)}
                className="bg-slate-900 border border-cyan-500/20 text-cyan-400 font-bold rounded p-2 outline-none text-sm"
              >
                {civilizations.map((civ) => (
                  <option key={civ.id} value={civ.id}>
                    {civ.species.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedCiv && (
              <div className="text-xs text-slate-400">
                Tech Level {selectedCiv.technology?.level ?? 0} · Era{" "}
                {selectedCiv.technology?.era ?? "Unknown"} · {progress}% complete
              </div>
            )}
          </div>
        )}
      </header>

      {civilizations.length === 0 ? (
        <div className="text-yellow-500 border border-yellow-500/20 bg-yellow-950/20 p-6 rounded-xl text-center">
          No civilizations in this galaxy yet. Advance the simulation to unlock
          research.
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Research Progress</span>
              <span>
                {unlockedCount}/{TECH_TREE_NODES.length} technologies
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Horizontal progression path */}
          <div className="hidden lg:flex items-center gap-1 mb-8 overflow-x-auto pb-2">
            {TECH_TREE_NODES.map((node, i) => {
              const status = getStatus(node);
              return (
                <div key={node.name} className="flex items-center shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === "UNLOCKED"
                        ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        : status === "RESEARCHABLE"
                          ? "bg-cyan-400 animate-pulse"
                          : "bg-slate-700"
                    }`}
                    title={node.name}
                  />
                  {i < TECH_TREE_NODES.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ${
                        status === "UNLOCKED" ? "bg-green-500/50" : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-8">
            {["Stone Age", "Bronze Age", "Industrial Age", "Digital Age", "Space Age", "Interstellar Age", "Transcendent Age"].map(
              (era) => {
                const eraNodes = TECH_TREE_NODES.filter((n) => n.era === era);
                if (eraNodes.length === 0) return null;

                return (
                  <HudPanel key={era} title={era} accent="purple">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {eraNodes.map((node) => {
                        const status = getStatus(node);
                        let borderClass =
                          "border-slate-800 bg-slate-950/40 text-slate-500";
                        let statusText = "🔒 Locked";

                        if (status === "UNLOCKED") {
                          borderClass =
                            "border-green-500/50 bg-green-950/15 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                          statusText = "✓ Unlocked";
                        } else if (status === "RESEARCHABLE") {
                          borderClass =
                            "border-cyan-400/50 bg-cyan-950/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]";
                          statusText = "⚡ Researchable";
                        }

                        return (
                          <div
                            key={node.name}
                            className={`border-2 rounded-xl p-4 transition duration-300 hover:scale-[1.01] ${borderClass}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] tracking-widest uppercase font-bold opacity-60">
                                {node.era}
                              </span>
                              <span className="text-xs font-mono opacity-60">
                                {node.cost} Int
                              </span>
                            </div>
                            <h3 className="text-base font-black text-white">
                              {node.name}
                            </h3>
                            <p className="text-xs font-semibold uppercase mt-1 opacity-80">
                              {statusText}
                            </p>
                            {node.prerequisites.length > 0 && (
                              <div className="mt-2 text-[10px] opacity-60 uppercase">
                                Requires: {node.prerequisites.join(", ")}
                              </div>
                            )}
                            <div className="mt-3 pt-2 border-t border-slate-800/50 space-y-1 text-xs">
                              {node.effects.productionMultiplier && (
                                <div className="flex justify-between">
                                  <span>Production</span>
                                  <span className="text-green-400 font-bold">
                                    ×{node.effects.productionMultiplier}
                                  </span>
                                </div>
                              )}
                              {node.effects.militaryPowerBonus && (
                                <div className="flex justify-between">
                                  <span>Military</span>
                                  <span className="text-red-400 font-bold">
                                    +{node.effects.militaryPowerBonus}
                                  </span>
                                </div>
                              )}
                              {node.effects.fleetStrengthBonus && (
                                <div className="flex justify-between">
                                  <span>Fleet</span>
                                  <span className="text-indigo-400 font-bold">
                                    +{node.effects.fleetStrengthBonus}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </HudPanel>
                );
              }
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
