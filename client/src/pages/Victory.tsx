import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import CommandStatCard from "../components/CommandStatCard";
import LoadingState from "../components/LoadingState";
import {
  computeVictories,
  findCivByName,
  type VictoryType,
} from "../utils/gameCalculations";

const colorMap: Record<string, string> = {
  red: "border-red-500/40 text-red-400",
  green: "border-green-500/40 text-green-400",
  purple: "border-purple-500/40 text-purple-400",
  cyan: "border-cyan-500/40 text-cyan-400",
  yellow: "border-yellow-500/40 text-yellow-400",
};

function Victory() {
  const navigate = useNavigate();
  const worldId = localStorage.getItem("worldId");
  const [victories, setVictories] = useState<VictoryType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, civRes, warsRes, alliancesRes, statsRes] =
          await Promise.all([
            api.get("/analytics"),
            api.get("/civilizations"),
            api.get("/wars"),
            api.get("/alliances"),
            worldId
              ? api.get(`/statistics/${worldId}`)
              : Promise.resolve({ data: { stats: null } }),
          ]);

        const civs = civRes.data.civilizations ?? [];
        setCivilizations(civs);
        setStats(statsRes.data.stats);

        setVictories(
          computeVictories({
            civilizations: civs,
            wars: warsRes.data.wars ?? [],
            alliances: alliancesRes.data.alliances ?? [],
            analytics: analyticsRes.data.analytics,
            stats: statsRes.data.stats,
            worldId,
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [worldId]);

  const achieved = victories.filter((v) => v.achieved);
  const domination = victories.find((v) => v.id === "domination");

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Analyzing Victory Conditions..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/70 mb-2">
          Endgame Analysis
        </p>
        <h1 className="text-4xl font-black text-yellow-400">
          Victory Conditions
        </h1>
        <p className="text-slate-400 mt-2">
          {achieved.length}/{victories.length} victory paths achieved
        </p>
      </header>

      {domination?.achieved && (
        <div className="mb-8 p-6 rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-950/40 to-amber-950/20 text-center animate-pulse">
          <div className="text-5xl mb-2">🌌</div>
          <h2 className="text-2xl font-black text-yellow-300">
            GALACTIC DOMINATION ACHIEVED
          </h2>
          <p className="text-yellow-400/80 mt-2">
            {domination.leader} leads in military, economy, and technology.
          </p>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <CommandStatCard
            label="Current Year"
            value={stats.currentYear ?? 0}
            accent="cyan"
          />
          <CommandStatCard
            label="Civilizations"
            value={stats.civilizationCount ?? 0}
            accent="purple"
          />
          <CommandStatCard
            label="Wars"
            value={stats.warCount ?? 0}
            accent="red"
          />
          <CommandStatCard
            label="Alliances"
            value={stats.allianceCount ?? 0}
            accent="green"
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {victories.map((v) => {
          const leaderCiv = findCivByName(civilizations, v.leader);
          return (
            <HudPanel
              key={v.id}
              title={`${v.icon} ${v.title}`}
              accent={
                v.achieved
                  ? (v.color as "yellow" | "red" | "green" | "purple" | "cyan")
                  : "indigo"
              }
              className={v.achieved ? "ring-1 ring-yellow-500/20" : ""}
            >
              <p className="text-sm text-slate-400 mb-4">{v.description}</p>

              {v.achieved && (
                <div className="mb-3 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase inline-block">
                  Victory Achieved
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase">
                    Current Leader
                  </div>
                  <div
                    className={`text-lg font-bold ${colorMap[v.color]?.split(" ")[1] ?? "text-white"}`}
                  >
                    {v.leader}
                  </div>
                </div>
                {leaderCiv && (
                  <button
                    onClick={() => navigate(`/empire/${leaderCiv.id}`)}
                    className="text-xs px-3 py-1.5 rounded border border-slate-700 hover:border-cyan-500/40 text-cyan-400 transition"
                  >
                    View Empire
                  </button>
                )}
              </div>
            </HudPanel>
          );
        })}
      </div>
    </Layout>
  );
}

export default Victory;
