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

  useEffect(() => {

    const worldId =
      localStorage.getItem("worldId");

    if (!worldId) return;

    const fetchData =
      async () => {

        const statsResponse =
          await api.get(
            `/statistics/${worldId}`
          );

        const analyticsResponse =
          await api.get(
            "/analytics"
          );

        setStats(
          statsResponse.data.stats
        );

        setAnalytics(
          analyticsResponse.data.analytics
        );
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
      EvoVerse Dashboard
    </h1>

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

    {/* Analytics */}

    <div className="mt-12">

      <h2 className="text-3xl font-bold mb-6">
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
          value={analytics.strongestCivilization}
        />

        <AnalyticsCard
          icon="💰"
          title="Richest Civilization"
          value={analytics.richestCivilization}
        />

        <AnalyticsCard
          icon="🚀"
          title="Most Advanced Civilization"
          value={analytics.mostAdvancedCivilization}
        />

        <AnalyticsCard
          icon="👥"
          title="Largest Population"
          value={analytics.largestPopulation}
        />
      </div>

    </div>

  </Layout>
);
}

export default Dashboard;