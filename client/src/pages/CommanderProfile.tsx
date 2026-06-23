import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";
import RankBadge from "../components/RankBadge";
import StatCard from "../components/StatCard";

export default function CommanderProfile() {
  const [commander, setCommander] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [worlds, setWorlds] = useState<any[]>([]);
  const [civs, setCivs] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/commander/profile");
        setCommander(res.data.commander);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const w = await api.get("/worlds");
        setWorlds(w.data.worlds || []);

        const civ = await api.get("/civilizations");
        setCivs(civ.data.civilizations || []);
      } catch (err) {
        console.error("Failed to load additional commander data", err);
      }
    };

    fetchDetails();
  }, []);

  const getNextRankMilestone = (rank: string) => {
    switch (rank) {
      case "Bronze": return { next: "Silver", xp: 500 };
      case "Silver": return { next: "Gold", xp: 1500 };
      case "Gold": return { next: "Platinum", xp: 3000 };
      case "Platinum": return { next: "Diamond", xp: 5000 };
      case "Diamond": return { next: "Master", xp: 8000 };
      case "Master": return { next: "Legend", xp: 12000 };
      default: return { next: "Max Rank reached", xp: 12000 };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-cyan-400 font-bold p-8">Loading Commander Dossier...</div>
      </Layout>
    );
  }

  if (!commander) {
    return (
      <Layout>
        <div className="text-red-500 font-bold p-8">Error: Failed to synchronize Commander Profile.</div>
      </Layout>
    );
  }

  const milestone = getNextRankMilestone(commander.rank);
  const percent = Math.min(100, Math.floor((commander.xp / milestone.xp) * 100));

  const achievementsCount = (() => {
    try {
      const arr = JSON.parse(commander.achievementsJson || "[]");
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  })();

  const worldIds = worlds.map((w) => w.id);
  const civilizationsGuided = civs.filter((c) => c.species && worldIds.includes(c.species.worldId)).length;

  return (
    <Layout>
      <h1 className="text-5xl font-black text-cyan-400 mb-10 tracking-wide border-b border-slate-800 pb-4">
        COMMANDER DOSSIER
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(6,182,212,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="mb-4">
            <RankBadge rank={commander.rank} size="lg" />
          </div>

          <h2 className="text-2xl font-black tracking-wide text-cyan-300">{commander.name}</h2>
          <p className="text-xs uppercase text-slate-500 tracking-widest mt-1">Galactic Ruler ID</p>

          <div className="w-full border-t border-slate-800 my-6 pt-4 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase">Rank Status</span>
              <span className="font-bold text-cyan-400">{commander.rank} Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase">Reputation</span>
              <span className="font-bold text-green-400">{commander.reputation} / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase">Experience</span>
              <span className="font-bold text-slate-300">{commander.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Progression & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* XP Progress Bar */}
          <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">
              XP Rank Progression
            </h3>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Current XP: {commander.xp}</span>
              <span className="text-cyan-400 font-bold">Next Rank: {milestone.next} ({milestone.xp} XP)</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-right text-[10px] text-slate-500 uppercase mt-2">{percent}% Completed to next tier</p>
          </div>

          {/* Small stat grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Achievements" value={achievementsCount} hint="Galactic ribbons earned" />
            <StatCard label="Worlds Created" value={worlds.length} hint="Active simulations you own" />
            <StatCard label="Civilizations Guided" value={civilizationsGuided} hint="Empires under your command" />
          </div>

        </div>

      </div>
    </Layout>
  );
}
