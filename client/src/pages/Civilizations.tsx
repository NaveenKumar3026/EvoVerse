import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";
import { getCivPower } from "../utils/gameCalculations";

function Civilizations() {
  const navigate = useNavigate();
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await api.get("/civilizations");
        let civs = response.data.civilizations ?? [];
        if (worldId) {
          civs = civs.filter((c: any) => c.species?.worldId === worldId);
        }
        setCivilizations(civs);
      } catch (error) {
        console.error("Failed to load civilizations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCivilizations();
  }, [worldId]);

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Scanning Empires..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
          Diplomatic Registry
        </p>
        <h1 className="text-4xl font-black text-cyan-400">Civilizations</h1>
        <p className="text-slate-400 mt-2">
          {civilizations.length} empire(s) detected · Click to view dossier
        </p>
      </header>

      {civilizations.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No civilizations have emerged yet. Advance the simulation.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {civilizations.map((civ) => {
            const power = getCivPower(civ);
            return (
              <button
                key={civ.id}
                onClick={() => navigate(`/empire/${civ.id}`)}
                className="text-left group"
              >
                <HudPanel
                  title={civ.species.name}
                  subtitle={`${civ.stage} · Power ${power}`}
                  accent="cyan"
                  className="transition-all duration-300 group-hover:scale-[1.01] group-hover:border-cyan-500/40"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Population</span>
                      <div className="text-cyan-300 font-bold">
                        {civ.species.population}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Technology</span>
                      <div className="text-purple-300 font-bold">
                        Lv {civ.technology?.level ?? 0}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Era</span>
                      <div className="text-white">
                        {civ.technology?.era ?? "—"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Military</span>
                      <div className="text-red-300 font-bold">
                        {civ.militaryPower ?? 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-cyan-500/70 uppercase tracking-wider group-hover:text-cyan-400 transition">
                    Open Empire Profile →
                  </div>
                </HudPanel>
              </button>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

export default Civilizations;
