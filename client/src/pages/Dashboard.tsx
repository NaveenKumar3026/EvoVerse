import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import CommandStatCard from "../components/CommandStatCard";
import LoadingState from "../components/LoadingState";
import {
  getGalacticEra,
  getGalaxyStability,
  findCivByName,
  type WorldStats,
  type Analytics,
} from "../utils/gameCalculations";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WorldStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    if (!worldId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes, timelineRes, civRes] =
          await Promise.all([
            api.get(`/statistics/${worldId}`),
            api.get("/analytics"),
            api.get(`/evolution/history/${worldId}`),
            api.get("/civilizations"),
          ]);

        setStats(statsRes.data.stats);
        setAnalytics(analyticsRes.data.analytics);
        setEvents(timelineRes.data.history ?? []);
        setCivilizations(civRes.data.civilizations ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [worldId]);

  if (!worldId) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            No Active Simulation
          </h2>
          <p className="text-slate-400 mb-6">
            Select or create a world from the main menu to access command.
          </p>
          <button
            onClick={() => navigate("/create-world")}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition"
          >
            Initialize Galaxy
          </button>
        </div>
      </Layout>
    );
  }

  if (loading || !stats || !analytics) {
    return (
      <Layout>
        <LoadingState label="Establishing Command Link..." />
      </Layout>
    );
  }

  const era = getGalacticEra(stats);
  const stability = getGalaxyStability(stats);
  const dominantCiv = findCivByName(
    civilizations,
    analytics.strongestCivilization
  );

  const stabilityColor =
    stability.tone === "stable"
      ? "text-green-400"
      : stability.tone === "tense"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <Layout>
      <header className="mb-8 relative">
        <div className="absolute -inset-x-4 -top-4 h-24 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
          Strategic Operations · Sector Command
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400">
          Galactic Command Center
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Monitor galactic stability, empire standings, and live intelligence
          from your central command bridge.
        </p>
      </header>

      {/* Primary command readouts */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <CommandStatCard
          label="Current Year"
          value={stats.currentYear ?? 0}
          icon="⏳"
          accent="cyan"
          hint="Simulation timeline"
        />
        <CommandStatCard
          label="Galactic Era"
          value={era}
          icon="🌠"
          accent="purple"
          hint="Age of civilization"
        />
        <CommandStatCard
          label="Dominant Empire"
          value={analytics.strongestCivilization ?? "—"}
          icon="👑"
          accent="yellow"
          hint="Military supremacy"
        />
        <CommandStatCard
          label="Galaxy Stability"
          value={
            <span className={stabilityColor}>
              {stability.label} ({stability.score}%)
            </span>
          }
          icon="🛡️"
          accent={
            stability.tone === "stable"
              ? "green"
              : stability.tone === "tense"
                ? "yellow"
                : "red"
          }
          hint="Diplomatic climate"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CommandStatCard
          label="Civilizations"
          value={stats.civilizationCount ?? 0}
          icon="🌍"
          accent="cyan"
        />
        <CommandStatCard
          label="Wars"
          value={stats.warCount ?? 0}
          icon="⚔️"
          accent="red"
        />
        <CommandStatCard
          label="Alliances"
          value={stats.allianceCount ?? 0}
          icon="🤝"
          accent="green"
        />
        <CommandStatCard
          label="Trades"
          value={stats.tradeCount ?? 0}
          icon="💱"
          accent="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <HudPanel
          title="Empire Rankings"
          subtitle="Live galactic power index"
          accent="yellow"
          className="lg:col-span-1"
        >
          <div className="space-y-3 text-sm">
            {[
              { label: "Strongest", value: analytics.strongestCivilization, color: "text-cyan-400" },
              { label: "Richest", value: analytics.richestCivilization, color: "text-green-400" },
              { label: "Most Advanced", value: analytics.mostAdvancedCivilization, color: "text-purple-400" },
              { label: "Largest Population", value: analytics.largestPopulation, color: "text-yellow-400" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-2 border-b border-slate-800/80 last:border-0"
              >
                <span className="text-slate-400">{row.label}</span>
                <span className={`font-bold ${row.color}`}>{row.value ?? "—"}</span>
              </div>
            ))}
          </div>
          {dominantCiv && (
            <button
              onClick={() => navigate(`/empire/${dominantCiv.id}`)}
              className="mt-4 w-full text-xs uppercase tracking-wider py-2 rounded-lg border border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40 transition"
            >
              View Dominant Empire →
            </button>
          )}
        </HudPanel>

        <HudPanel
          title="Quick Deployment"
          subtitle="Strategic action channels"
          accent="cyan"
          className="lg:col-span-1"
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: "/simulation", label: "Run Simulation", icon: "⚡" },
              { to: "/galaxy", label: "Galaxy Map", icon: "🌌" },
              { to: "/tech-tree", label: "Tech Tree", icon: "🔬" },
              { to: "/story", label: "AI Historian", icon: "📖" },
              { to: "/victory", label: "Victory Status", icon: "🏆" },
              { to: "/civilizations", label: "All Empires", icon: "🌍" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition text-center"
              >
                <div className="text-lg">{action.icon}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
                  {action.label}
                </div>
              </Link>
            ))}
          </div>
        </HudPanel>

        <HudPanel
          title="Stability Analysis"
          subtitle="Conflict vs cooperation index"
          accent={
            stability.tone === "stable"
              ? "green"
              : stability.tone === "tense"
                ? "yellow"
                : "red"
          }
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Stability Meter</span>
                <span>{stability.score}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    stability.tone === "stable"
                      ? "bg-green-500"
                      : stability.tone === "tense"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${stability.score}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {(stats.warCount ?? 0) > (stats.allianceCount ?? 0)
                ? "Military tensions are elevated. Monitor war activity across sectors."
                : "Diplomatic channels remain open. Trade and alliances support stability."}
            </p>
          </div>
        </HudPanel>
      </div>

      <HudPanel
        title="Galactic Intelligence Feed"
        subtitle="Latest events from evolution history"
        accent="indigo"
      >
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {events.length === 0 ? (
            <p className="text-slate-500 text-sm">No events recorded yet. Run the simulation.</p>
          ) : (
            events
              .slice(-12)
              .reverse()
              .map((event, index) => (
                <div
                  key={`${event.year}-${index}`}
                  className="flex gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-cyan-500/20 transition"
                >
                  <div className="text-cyan-500 font-mono text-xs whitespace-nowrap pt-0.5">
                    Y{event.year}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                      {event.eventType?.replace(/_/g, " ") ?? "Event"}
                    </div>
                    <p className="text-sm text-slate-300">{event.description}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </HudPanel>
    </Layout>
  );
}

export default Dashboard;
