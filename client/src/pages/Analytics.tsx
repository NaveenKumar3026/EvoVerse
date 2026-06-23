import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";

function Analytics() {
  const [chartData, setChartData] = useState<
    { year: number; events: number }[]
  >([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    const load = async () => {
      try {
        const analyticsRes = await api.get("/analytics");
        setAnalytics(analyticsRes.data.analytics);

        if (worldId) {
          const histRes = await api.get(`/evolution/history/${worldId}`);
          const history = histRes.data.history ?? [];
          const byYear = new Map<number, number>();
          for (const e of history) {
            byYear.set(e.year, (byYear.get(e.year) ?? 0) + 1);
          }
          const data = [...byYear.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([year, events]) => ({ year, events }));
          setChartData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [worldId]);

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Compiling Analytics..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
          Intelligence Division
        </p>
        <h1 className="text-4xl font-black text-cyan-400">Analytics</h1>
      </header>

      {analytics && (
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Strongest", value: analytics.strongestCivilization },
            { label: "Richest", value: analytics.richestCivilization },
            { label: "Most Advanced", value: analytics.mostAdvancedCivilization },
            { label: "Largest Pop", value: analytics.largestPopulation },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
            >
              <div className="text-[10px] uppercase text-slate-500">
                {item.label}
              </div>
              <div className="font-bold text-cyan-400 mt-1 text-sm">
                {item.value ?? "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      <HudPanel
        title="Galactic Event Frequency"
        subtitle="Events per simulation year"
        accent="cyan"
      >
        {chartData.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            No timeline data. Run the simulation to generate analytics.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                }}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: "#22d3ee" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </HudPanel>
    </Layout>
  );
}

export default Analytics;
