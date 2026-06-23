import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";
import GalaxyMapCanvas from "../components/GalaxyMapCanvas";
import { filterWorldCivilizations } from "../utils/gameCalculations";

function Galaxy() {
  const navigate = useNavigate();
  const worldId = localStorage.getItem("worldId");
  const [galaxy, setGalaxy] = useState<any[]>([]);
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [wars, setWars] = useState<any[]>([]);
  const [alliances, setAlliances] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!worldId) {
      setLoading(false);
      return;
    }

    try {
      const [galaxyRes, civRes, warsRes, alliancesRes, tradesRes, analyticsRes] =
        await Promise.all([
          api.get(`/stars/galaxy/${worldId}`),
          api.get("/civilizations"),
          api.get("/wars"),
          api.get("/alliances"),
          api.get("/trades"),
          api.get("/analytics"),
        ]);

      setGalaxy(galaxyRes.data.galaxy ?? []);
      setCivilizations(civRes.data.civilizations ?? []);
      setWars(warsRes.data.wars ?? []);
      setAlliances(alliancesRes.data.alliances ?? []);
      setTrades(tradesRes.data.trades ?? []);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const worldCivs = filterWorldCivilizations(civilizations, worldId);

  if (!worldId) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-slate-400 mb-4">No active world selected.</p>
          <button
            onClick={() => navigate("/create-world")}
            className="px-6 py-3 bg-cyan-600 rounded-xl font-bold"
          >
            Create World
          </button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Charting Star Systems..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
          Sector Navigation · Live Star Chart
        </p>
        <h1 className="text-4xl font-black text-cyan-300">Galaxy Map</h1>
        <p className="text-slate-400 mt-2">
          Pan, zoom, and inspect star systems. Colonize unclaimed worlds.
        </p>
      </header>

      {analytics && (
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Strongest", value: analytics.strongestCivilization, cls: "text-cyan-400" },
            { label: "Richest", value: analytics.richestCivilization, cls: "text-green-400" },
            { label: "Most Advanced", value: analytics.mostAdvancedCivilization, cls: "text-purple-400" },
            { label: "Largest Pop", value: analytics.largestPopulation, cls: "text-yellow-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
            >
              <div className="text-[10px] uppercase text-slate-500">
                {item.label}
              </div>
              <div className={`font-bold mt-1 text-sm ${item.cls}`}>
                {item.value ?? "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      <GalaxyMapCanvas
        galaxy={galaxy}
        civilizations={civilizations}
        wars={wars}
        trades={trades}
        worldId={worldId}
        onRefresh={fetchData}
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <HudPanel title="Empires in Sector" accent="cyan">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {worldCivs.length === 0 ? (
              <p className="text-slate-500 text-sm">No civilizations yet.</p>
            ) : (
              worldCivs.map((civ) => (
                <button
                  key={civ.id}
                  onClick={() => navigate(`/empire/${civ.id}`)}
                  className="w-full text-left p-2 rounded bg-slate-950/50 border border-slate-800 hover:border-cyan-500/30 transition text-sm"
                >
                  <span className="text-cyan-300 font-bold">
                    {civ.species.name}
                  </span>
                  <span className="text-slate-500 ml-2 text-xs">
                    Pop {civ.species.population}
                  </span>
                </button>
              ))
            )}
          </div>
        </HudPanel>

        <HudPanel title="Recent Wars" accent="red">
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {wars.slice(0, 5).map((war) => (
              <div
                key={war.id}
                className="p-2 rounded bg-slate-950/50 border border-red-900/30"
              >
                Year {war.year} · Winner: {war.winner?.slice(0, 8) ?? "—"}
              </div>
            ))}
            {wars.length === 0 && (
              <p className="text-slate-500">No wars recorded.</p>
            )}
          </div>
        </HudPanel>

        <HudPanel title="Alliances & Trade" accent="green">
          <div className="text-xs space-y-2">
            <p className="text-slate-400">
              {alliances.length} alliance(s) · {trades.length} trade route(s)
            </p>
          </div>
        </HudPanel>
      </div>
    </Layout>
  );
}

export default Galaxy;
