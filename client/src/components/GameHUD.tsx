import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

type WorldStats = {
  currentYear?: number;
  speciesCount?: number;
  civilizationCount?: number;
  warCount?: number;
  allianceCount?: number;
  tradeCount?: number;
};

export default function GameHUD() {
  const [stats, setStats] = useState<WorldStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const worldId = localStorage.getItem("worldId");
        if (!worldId) return;

        const res = await api.get(`/statistics/${worldId}`);
        setStats(res.data.stats ?? null);
      } catch {
        // ignore
      }
    };

    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  if (!stats) return null;

  return (
    <div className="fixed top-4 right-4 bg-slate-900/70 border border-cyan-500/10 rounded-xl p-3 text-xs text-slate-200 backdrop-blur-md z-40">
      <div className="flex items-center gap-3">
        <div className="text-cyan-300 font-bold tracking-wider">HUD</div>
        <div className="text-slate-400">
          Year: <span className="text-cyan-200">{stats.currentYear ?? "—"}</span>
        </div>
        <div className="text-slate-400">
          Civs: <span className="text-cyan-200">{stats.civilizationCount ?? "—"}</span>
        </div>
        <div className="text-slate-400">
          Wars: <span className="text-cyan-200">{stats.warCount ?? "—"}</span>
        </div>
        <Link
          to="/"
          className="text-slate-500 hover:text-cyan-400 transition ml-1"
          title="Main Menu"
        >
          ⌂
        </Link>
      </div>
    </div>
  );
}
