import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Victory() {

  const [analytics, setAnalytics] =
    useState<any>(null);

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const response =
            await api.get(
              "/analytics"
            );

          setAnalytics(
            response.data.analytics
          );

        } catch (error) {

          console.error(error);

        }

      };

    fetchAnalytics();

  }, []);

  if (!analytics) {

    return (

      <Layout>
        <div>Loading...</div>
      </Layout>

    );

  }

  return (

    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-yellow-400
        mb-10
        "
      >
        🏆 Victory Conditions
      </h1>

      <div
        className="
        grid
        md:grid-cols-2
        gap-6
        "
      >

        <div
          className="
          bg-slate-900
          p-6
          rounded-xl
          border
          border-red-500/30
          "
        >
          <h2 className="text-2xl font-bold">
            ⚔ Military Victory
          </h2>

          <p className="mt-4">
            Leader:
          </p>

          <p className="text-red-400 font-bold">
            {analytics.strongestCivilization}
          </p>
        </div>

        <div
          className="
          bg-slate-900
          p-6
          rounded-xl
          border
          border-green-500/30
          "
        >
          <h2 className="text-2xl font-bold">
            💰 Economic Victory
          </h2>

          <p className="mt-4">
            Leader:
          </p>

          <p className="text-green-400 font-bold">
            {analytics.richestCivilization}
          </p>
        </div>

        <div
          className="
          bg-slate-900
          p-6
          rounded-xl
          border
          border-purple-500/30
          "
        >
          <h2 className="text-2xl font-bold">
            🚀 Technology Victory
          </h2>

          <p className="mt-4">
            Leader:
          </p>

          <p className="text-purple-400 font-bold">
            {analytics.mostAdvancedCivilization}
          </p>
        </div>

        <div
          className="
          bg-slate-900
          p-6
          rounded-xl
          border
          border-yellow-500/30
          "
        >
          <h2 className="text-2xl font-bold">
            👥 Population Victory
          </h2>

          <p className="mt-4">
            Leader:
          </p>

          <p className="text-yellow-400 font-bold">
            {analytics.largestPopulation}
          </p>
        </div>

      </div>

    </Layout>

  );
}

export default Victory;