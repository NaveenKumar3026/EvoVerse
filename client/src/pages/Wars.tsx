import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Wars() {

  const [wars, setWars] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchWars =
      async () => {

        const response =
          await api.get(
            "/wars"
          );

        setWars(
          response.data.wars
        );
      };

    fetchWars();

  }, []);

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-red-400
        mb-10
        "
      >
        War History
      </h1>

      <div className="space-y-4">

        {wars.map((war) => (

          <div
            key={war.id}
            className="
            bg-slate-900
            border
            border-red-500/20
            rounded-xl
            p-5
            "
          >
            <p>
              <strong>Year:</strong>
              {" "}
              {war.year}
            </p>

            <p>
              <strong>Winner:</strong>
              {" "}
              {war.winner}
            </p>

            <p className="text-gray-400">
              Attacker:
              {" "}
              {war.attackerId}
            </p>

            <p className="text-gray-400">
              Defender:
              {" "}
              {war.defenderId}
            </p>
          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Wars;