import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import NebulaBackground from "../components/NebulaBackground";
import LobbyHero from "../components/LobbyHero";
import WorldCard from "../components/WorldCard";

export default function MainMenu() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [worlds, setWorlds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const loadWorlds = async () => {
      setLoading(true);
      try {
        const res = await api.get("/worlds");
        setWorlds(res.data.worlds || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWorlds();
  }, [token]);

  const handleContinue = () => {
    const worldId = localStorage.getItem("worldId");
    if (worldId) {
      navigate("/dashboard");
    } else {
      navigate("/create-world");
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden font-sans">
      <NebulaBackground />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <LobbyHero />

            <div className="mt-6 bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-4">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={handleContinue} className="p-4 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-500 hover:scale-[1.01] transition">Continue Simulation</button>
                <button onClick={() => navigate("/create-world")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Create New World</button>
                <button onClick={() => navigate("/galaxy")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Galaxy Map</button>
                <button onClick={() => navigate("/profile")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Commander Profile</button>
                <button onClick={() => navigate("/tech-tree")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Tech Tree</button>
                <button onClick={() => navigate("/achievements")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Achievements</button>
                <button onClick={() => navigate("/leaderboards")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">Leaderboards</button>
                <button onClick={() => navigate("/story")} className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:scale-[1.01] transition">AI Historian</button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Your Worlds</h3>
              {loading ? (
                <div className="text-slate-400">Loading worlds...</div>
              ) : worlds.length === 0 ? (
                <div className="text-slate-500">No worlds found. Create one to start your simulation.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {worlds.map((w) => (
                    <WorldCard key={w.id} world={{ ...w, civilizationCount: w.civilizations?.length ?? 0 }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="p-4 bg-slate-900/60 border border-cyan-500/10 rounded-2xl">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Commander Quick Panel</h4>
              <div className="text-slate-400 text-sm">Use the Commander panel to manage your profile and active simulations.</div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-cyan-500/10 rounded-2xl">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Featured</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800 rounded">Top civilizations and events will appear here.</div>
                <div className="p-3 bg-slate-800 rounded">AI Historian highlights.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
