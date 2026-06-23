import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import NebulaBackground from "../components/NebulaBackground";

export default function GameLobby() {
  const navigate = useNavigate();
  const [worldName, setWorldName] = useState("Milky Way");
  const [season, setSeason] = useState("Season 1: Rise of Civilizations");
  const [disasterFrequency, setDisasterFrequency] = useState(10);
  
  // Species parameters
  const [speciesName, setSpeciesName] = useState("Terran Neo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateGalaxy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create the World
      const worldRes = await api.post("/worlds", {
        name: worldName,
        season
      });

      if (!worldRes.data.success || !worldRes.data.world) {
        throw new Error("Failed to initialize World database record");
      }

      const worldId = worldRes.data.world.id;

      // 2. Create the Starting Species
      const speciesRes = await api.post("/species", {
        worldId,
        name: speciesName
      });

      if (!speciesRes.data.success) {
        throw new Error("Failed to initialize Species database record");
      }

      // Save active world ID to local storage
      localStorage.setItem("worldId", worldId);

      // Navigate to Command Center
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to initialize simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white p-6 font-sans">
      <NebulaBackground />

      <div className="relative w-full max-w-2xl bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-md">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-wide text-cyan-400">
              GALAXY INITIALIZATION
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Configure parameters to seed a new simulation universe
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-xs uppercase bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 px-3 py-1.5 rounded transition"
          >
            ← Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 rounded text-red-400 text-sm text-center">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleCreateGalaxy} className="space-y-6">
          
          {/* Section 1: Galaxy Settings */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              1. Galaxy Parameters
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">Galaxy Name</label>
                <input
                  type="text"
                  required
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 rounded p-2.5 outline-none transition text-sm"
                  placeholder="e.g. Andromeda II"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">Galactic Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 rounded p-2.5 outline-none transition text-sm"
                >
                  <option value="Season 1: Rise of Civilizations">Season 1: Rise of Civilizations</option>
                  <option value="Season 2: Age of Expansion">Season 2: Age of Expansion</option>
                  <option value="Season 3: Galactic Conquest">Season 3: Galactic Conquest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-xs uppercase text-slate-400 mb-1">
                <span>Disaster Frequency</span>
                <span className="text-yellow-400 font-bold">{disasterFrequency}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={disasterFrequency}
                onChange={(e) => setDisasterFrequency(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[10px] text-slate-500 uppercase mt-1">
                Higher frequencies cause more frequent meteors, ice ages, or plagues in systems.
              </p>
            </div>
          </div>

          {/* Section 2: Starting Species */}
          <div className="space-y-4 border-t border-slate-900 pt-6">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              2. Starting Species DNA
            </h2>

            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Species Name</label>
              <input
                type="text"
                required
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 rounded p-2.5 outline-none transition text-sm"
                placeholder="e.g. Aurel Prime"
              />
              <p className="text-[10px] text-slate-500 uppercase mt-1">
                This species will spawn in the galaxy with randomized DNA attributes (aggression, lifespan, intelligence).
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-cyan-50 font-bold uppercase tracking-wider p-4 rounded-xl shadow-lg border border-cyan-400/30 active:scale-98 transition mt-8"
          >
            {loading ? "Constructing Galactic Matrix..." : "Seed Universe & Start Simulation"}
          </button>
        </form>
      </div>
    </div>
  );
}
