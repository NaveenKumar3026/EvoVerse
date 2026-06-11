import { useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Simulation() {

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const runEvolution =
    async (years: number) => {

      try {

        setLoading(true);

        const worldId =
          localStorage.getItem("worldId");

        if (!worldId) {
          setMessage("World ID not found");
          return;
        }

        await api.post(
          `/evolution/run/${worldId}`,
          {
            years,
          }
        );

        setMessage(
          `Evolution advanced by ${years} years`
        );

      } catch {

        setMessage(
          "Simulation failed"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-cyan-400
        mb-10
      "
      >
        Simulation Control
      </h1>

      <div
        className="
        grid
        md:grid-cols-2
        gap-6
      "
      >

        <button
          onClick={() => runEvolution(1)}
          className="
          bg-cyan-600
          hover:bg-cyan-700
          rounded-xl
          p-6
          text-xl
          font-bold
        "
        >
          Run 1 Year
        </button>

        <button
          onClick={() => runEvolution(10)}
          className="
          bg-green-600
          hover:bg-green-700
          rounded-xl
          p-6
          text-xl
          font-bold
        "
        >
          Run 10 Years
        </button>

        <button
          onClick={() => runEvolution(100)}
          className="
          bg-yellow-600
          hover:bg-yellow-700
          rounded-xl
          p-6
          text-xl
          font-bold
        "
        >
          Run 100 Years
        </button>

        <button
          onClick={() => runEvolution(1000)}
          className="
          bg-red-600
          hover:bg-red-700
          rounded-xl
          p-6
          text-xl
          font-bold
        "
        >
          Run 1000 Years
        </button>

      </div>

      {loading && (

        <div
          className="
          mt-8
          text-cyan-400
          text-xl
        "
        >
          Running Simulation...
        </div>

      )}

      {message && (

        <div
          className="
          mt-8
          bg-slate-900
          border
          border-cyan-500/30
          rounded-xl
          p-5
        "
        >
          {message}
        </div>

      )}

    </Layout>
  );
}

export default Simulation;