import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import CommandStatCard from "../components/CommandStatCard";
import LoadingState from "../components/LoadingState";
import { getCivPower, getCivWealth } from "../utils/gameCalculations";

export default function EmpireProfile() {
  const { civilizationId } = useParams();
  const worldId = localStorage.getItem("worldId");
  const [civilization, setCivilization] = useState<any>(null);
  const [wars, setWars] = useState<any[]>([]);
  const [alliances, setAlliances] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [allCivs, setAllCivs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const civName = (id: string) =>
    allCivs.find((c) => c.id === id)?.species?.name ?? id.slice(0, 8);

  useEffect(() => {
    const load = async () => {
      if (!civilizationId) return;

      try {
        const [civRes, warsRes, alliancesRes, tradesRes] =
          await Promise.all([
            api.get("/civilizations"),
            api.get("/wars"),
            api.get("/alliances"),
            api.get("/trades"),
          ]);

        const civs = civRes.data.civilizations ?? [];
        setAllCivs(civs);
        const civ = civs.find((c: any) => c.id === civilizationId);
        setCivilization(civ ?? null);

        setWars(
          (warsRes.data.wars ?? []).filter(
            (w: any) =>
              w.attackerId === civilizationId ||
              w.defenderId === civilizationId
          )
        );
        setAlliances(
          (alliancesRes.data.alliances ?? []).filter(
            (a: any) =>
              a.civilizationAId === civilizationId ||
              a.civilizationBId === civilizationId
          )
        );
        setTrades(
          (tradesRes.data.trades ?? []).filter(
            (t: any) =>
              t.sellerId === civilizationId || t.buyerId === civilizationId
          )
        );

        if (worldId && civ) {
          const histRes = await api.get(`/evolution/history/${worldId}`);
          const history = histRes.data.history ?? [];
          const speciesName = civ.species?.name ?? "";
          setTimeline(
            history.filter(
              (e: any) =>
                e.description?.includes(speciesName) ||
                e.eventType === "CIVILIZATION_FORMED" ||
                e.eventType === "WAR" ||
                e.eventType === "ALLIANCE" ||
                e.eventType === "TRADE"
            )
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [civilizationId, worldId]);

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Scanning Empire Dossier..." />
      </Layout>
    );
  }

  if (!civilization) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Empire Not Found
          </h2>
          <Link to="/civilizations" className="text-cyan-400 hover:underline">
            ← Return to Civilizations
          </Link>
        </div>
      </Layout>
    );
  }

  const res = civilization.resource ?? {};
  const power = getCivPower(civilization);
  const wealth = getCivWealth(civilization);
  const status =
    power > 1000
      ? "Galactic Superpower"
      : power > 500
        ? "Rising Empire"
        : power > 200
          ? "Regional Power"
          : "Developing Nation";

  return (
    <Layout>
      <div className="mb-6">
        <Link
          to="/civilizations"
          className="text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400 transition"
        >
          ← All Empires
        </Link>
      </div>

      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
            Empire Dossier · {civilization.stage}
          </p>
          <h1 className="text-4xl font-black text-cyan-300">
            {civilization.species.name}
          </h1>
          <p className="text-slate-400 mt-2">{status}</p>
        </div>
        <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 text-sm font-bold">
          Military Power: {civilization.militaryPower ?? power}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CommandStatCard
          label="Population"
          value={civilization.species.population}
          icon="👥"
          accent="cyan"
        />
        <CommandStatCard
          label="Technology"
          value={`Lv ${civilization.technology?.level ?? 0}`}
          icon="🚀"
          accent="purple"
          hint={civilization.technology?.era}
        />
        <CommandStatCard
          label="Total Wealth"
          value={wealth}
          icon="💰"
          accent="green"
        />
        <CommandStatCard
          label="Fleet Strength"
          value={civilization.fleetStrength ?? 0}
          icon="🛸"
          accent="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <HudPanel title="Resource Stockpile" accent="green">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { k: "Food", v: res.food },
              { k: "Wood", v: res.wood },
              { k: "Stone", v: res.stone },
              { k: "Metal", v: res.metal },
              { k: "Energy", v: res.energy },
            ].map((r) => (
              <div
                key={r.k}
                className="flex justify-between p-2 rounded bg-slate-950/50 border border-slate-800"
              >
                <span className="text-slate-400">{r.k}</span>
                <span className="text-green-400 font-bold">{r.v ?? 0}</span>
              </div>
            ))}
          </div>
        </HudPanel>

        <HudPanel title="Empire Status" accent="cyan">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Stage</span>
              <span className="text-white font-bold">{civilization.stage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wars Involved</span>
              <span className="text-red-400 font-bold">{wars.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Alliances</span>
              <span className="text-yellow-400 font-bold">{alliances.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trade Routes</span>
              <span className="text-green-400 font-bold">{trades.length}</span>
            </div>
          </div>
        </HudPanel>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <HudPanel title="War Record" accent="red">
          {wars.length === 0 ? (
            <p className="text-slate-500 text-sm">No wars recorded.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {wars.slice(0, 8).map((w) => (
                <div
                  key={w.id}
                  className="text-xs p-2 rounded bg-slate-950/50 border border-red-900/30"
                >
                  <span className="text-red-400 font-bold">Y{w.year}</span>
                  {" · "}
                  {civName(w.attackerId)} vs {civName(w.defenderId)}
                  <br />
                  <span className="text-slate-500">
                    Winner: {civName(w.winner)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </HudPanel>

        <HudPanel title="Alliances" accent="yellow">
          {alliances.length === 0 ? (
            <p className="text-slate-500 text-sm">No alliances formed.</p>
          ) : (
            <div className="space-y-2">
              {alliances.map((a) => (
                <div
                  key={a.id}
                  className="text-xs p-2 rounded bg-slate-950/50 border border-yellow-900/30"
                >
                  {civName(a.civilizationAId)} ↔{" "}
                  {civName(a.civilizationBId)}
                </div>
              ))}
            </div>
          )}
        </HudPanel>

        <HudPanel title="Trade Routes" accent="green">
          {trades.length === 0 ? (
            <p className="text-slate-500 text-sm">No trade activity.</p>
          ) : (
            <div className="space-y-2">
              {trades.map((t) => (
                <div
                  key={t.id}
                  className="text-xs p-2 rounded bg-slate-950/50 border border-green-900/30"
                >
                  {civName(t.sellerId)} → {civName(t.buyerId)}
                  <br />
                  <span className="text-green-400">
                    {t.amount} {t.resource}
                  </span>
                </div>
              ))}
            </div>
          )}
        </HudPanel>
      </div>

      <HudPanel title="Civilization Timeline" accent="indigo">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {timeline.length === 0 ? (
            <p className="text-slate-500 text-sm">No timeline events found.</p>
          ) : (
            timeline
              .slice(-15)
              .reverse()
              .map((e, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-sm p-2 rounded bg-slate-950/40 border border-slate-800"
                >
                  <span className="text-cyan-500 font-mono text-xs">
                    Y{e.year}
                  </span>
                  <span className="text-slate-300">{e.description}</span>
                </div>
              ))
          )}
        </div>
      </HudPanel>
    </Layout>
  );
}
