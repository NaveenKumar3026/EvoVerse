import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function LobbyHero() {
  const [worldsCount, setWorldsCount] = useState<number | null>(null);
  const [civsCount, setCivsCount] = useState<number | null>(null);
  const [dominant, setDominant] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const w = await api.get("/worlds");
        const worlds = w.data.worlds || [];
        setWorldsCount(worlds.length);

        const c = await api.get("/civilizations");
        const civs = c.data.civilizations || [];
        setCivsCount(civs.length);

        // derive dominant civ and current year from first world if available
        if (worlds.length > 0) {
          const active = worlds[0];
          setYear(active.currentYear ?? active.year ?? null);
          // best-effort dominant civ
          if (civs.length > 0) setDominant(civs[0].name ?? civs[0].title ?? null);
        }
      } catch (err) {
        // ignore silently
      }
    };
    load();
  }, []);

  return (
    <div className="w-full rounded-2xl p-6 bg-gradient-to-r from-slate-900/60 to-slate-950/80 border border-cyan-500/10 shadow-[0_20px_60px_rgba(6,182,212,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400">EvoVerse</h1>
          <p className="text-slate-400 mt-1">An AI-driven civilization evolution simulation</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase">Galactic Era</div>
          <div className="font-bold text-cyan-300">Nebular Expansion</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Current Year</div>
          <div className="font-bold text-cyan-300">{year ?? "—"}</div>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Dominant Civilization</div>
          <div className="font-bold text-cyan-300">{dominant ?? "—"}</div>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Total Civilizations</div>
          <div className="font-bold text-cyan-300">{civsCount ?? "—"}</div>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Your Worlds</div>
          <div className="font-bold text-cyan-300">{worldsCount ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
