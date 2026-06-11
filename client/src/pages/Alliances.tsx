import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Alliances() {

  const [alliances, setAlliances] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchAlliances =
      async () => {

        const response =
          await api.get(
            "/alliances"
          );

        setAlliances(
          response.data.alliances
        );
      };

    fetchAlliances();

  }, []);

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
        Alliances
      </h1>

      <div className="space-y-4">

        {alliances.map((alliance) => (

          <div
            key={alliance.id}
            className="
            bg-slate-900
            border
            border-yellow-500/20
            rounded-xl
            p-5
            "
          >

            <p>
              <strong>
                Civilization A:
              </strong>
              {" "}
              {alliance.civilizationAId}
            </p>

            <p>
              <strong>
                Civilization B:
              </strong>
              {" "}
              {alliance.civilizationBId}
            </p>

            <p className="text-gray-400">
              Formed:
              {" "}
              {new Date(
                alliance.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Alliances;