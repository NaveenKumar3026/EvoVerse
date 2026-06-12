import { useEffect, useState } from "react";
import { api } from "../services/api";
import StatCard from "../components/StatCard";
import AnalyticsCard from "../components/AnalyticsCard";
import Layout from "../components/Layout";

function Dashboard() {

  const [stats, setStats] =
    useState<any>(null);

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [events, setEvents] =
    useState<any[]>([]);

    const getEra = () => {

  if (!analytics)
    return "Unknown Era";

  const techScore =
    stats.civilizationCount > 0
      ? (
          stats.tradeCount +
          stats.allianceCount +
          stats.warCount
        )
      : 0;

  if (techScore < 10)
    return "Primitive Age";

  if (techScore < 25)
    return "Industrial Age";

  if (techScore < 50)
    return "Space Age";

  if (techScore < 100)
    return "Interstellar Age";

  if (techScore < 200)
    return "Quantum Age";

  return "Transcendent Age";
};

  useEffect(() => {

    const worldId =
      localStorage.getItem("worldId");

    if (!worldId) return;

    const fetchData =
      async () => {

        try {

          const statsResponse =
            await api.get(
              `/statistics/${worldId}`
            );

          const analyticsResponse =
            await api.get(
              "/analytics"
            );

          const timelineResponse =
            await api.get(
              `/evolution/history/${worldId}`
            );

          setStats(
            statsResponse.data.stats
          );

          setAnalytics(
            analyticsResponse.data.analytics
          );

          setEvents(
            timelineResponse.data.history
          );

        } catch (error) {

          console.error(error);

        }

      };

    fetchData();

  }, []);

  if (!stats || !analytics) {

    return (

      <div className="text-white p-10">
        Loading...
      </div>

    );

  }

  return (

    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        mb-10
        text-cyan-400
        "
      >
        🌌 Galactic Command Center
      </h1>

      <div
  className="
  grid
  md:grid-cols-3
  gap-6
  mb-10
  "
>

  <div
    className="
    bg-slate-900
    border
    border-cyan-500/20
    rounded-xl
    p-6
    "
  >
    <p className="text-gray-400">
      Current Galactic Leader
    </p>

    <h2
      className="
      text-2xl
      font-bold
      text-cyan-400
      mt-2
      "
    >
      {analytics.strongestCivilization}
    </h2>
  </div>

  <div
    className="
    bg-slate-900
    border
    border-yellow-500/20
    rounded-xl
    p-6
    "
  >
    <p className="text-gray-400">
      Current Era
    </p>

    <h2
      className="
      text-2xl
      font-bold
      text-yellow-400
      mt-2
      "
    >
      {getEra()}
    </h2>
  </div>

  <div
    className="
    bg-slate-900
    border
    border-green-500/20
    rounded-xl
    p-6
    "
  >
    <p className="text-gray-400">
      Galaxy Stability
    </p>

    <h2
      className="
      text-2xl
      font-bold
      text-green-400
      mt-2
      "
    >
      {
        stats.warCount >
        stats.allianceCount
          ? "Unstable"
          : "Stable"
      }
    </h2>
  </div>

</div>

      {/* Statistics */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
        "
      >

        <StatCard
          title="Current Year"
          value={stats.currentYear}
        />

        <StatCard
  title="Galactic Era"
  value={getEra()}
/>

        <StatCard
          title="Species"
          value={stats.speciesCount}
        />

        <StatCard
          title="Civilizations"
          value={stats.civilizationCount}
        />

        <StatCard
          title="Wars"
          value={stats.warCount}
        />

        <StatCard
          title="Alliances"
          value={stats.allianceCount}
        />

        <StatCard
          title="Trades"
          value={stats.tradeCount}
        />

      </div>

      {/* Galactic Rankings */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          text-yellow-400
          mb-6
          "
        >
          🏆 Galactic Rankings
        </h2>

        <div
          className="
          bg-slate-900
          rounded-xl
          p-6
          border
          border-yellow-500/20
          "
        >

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>#1 Strongest Empire</span>
              <span className="text-cyan-400 font-bold">
                {analytics.strongestCivilization}
              </span>
            </div>

            <div className="flex justify-between">
              <span>#1 Richest Empire</span>
              <span className="text-green-400 font-bold">
                {analytics.richestCivilization}
              </span>
            </div>

            <div className="flex justify-between">
              <span>#1 Advanced Empire</span>
              <span className="text-purple-400 font-bold">
                {analytics.mostAdvancedCivilization}
              </span>
            </div>

            <div className="flex justify-between">
              <span>#1 Largest Population</span>
              <span className="text-yellow-400 font-bold">
                {analytics.largestPopulation}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Analytics */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          World Analytics
        </h2>

        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          "
        >

          <AnalyticsCard
            icon="🏆"
            title="Strongest Civilization"
            value={
              analytics.strongestCivilization
            }
          />

          <AnalyticsCard
            icon="💰"
            title="Richest Civilization"
            value={
              analytics.richestCivilization
            }
          />

          <AnalyticsCard
            icon="🚀"
            title="Most Advanced Civilization"
            value={
              analytics.mostAdvancedCivilization
            }
          />

          <AnalyticsCard
            icon="👥"
            title="Largest Population"
            value={
              analytics.largestPopulation
            }
          />

        </div>

      </div>

      {/* Galactic News Feed */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          text-cyan-400
          mb-6
          "
        >
          📡 Galactic News Feed
        </h2>

        <div
          className="
          bg-slate-900
          rounded-xl
          p-6
          border
          border-cyan-500/20
          space-y-4
          "
        >

          {events
            .slice(-10)
            .reverse()
            .map((event, index) => (

              <div
                key={index}
                className="
                border-b
                border-slate-700
                pb-3
                "
              >

                <span
                  className="
                  text-cyan-400
                  font-bold
                  "
                >
                  Year {event.year}
                </span>

                <p className="mt-1">
                  {event.description}
                </p>

              </div>

            ))}

        </div>

      </div>

    </Layout>

  );
}

export default Dashboard;