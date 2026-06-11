import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Trades() {

  const [trades, setTrades] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchTrades =
      async () => {

        const response =
          await api.get(
            "/trades"
          );

        setTrades(
          response.data.trades
        );
      };

    fetchTrades();

  }, []);

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-green-400
        mb-10
        "
      >
        Trade Network
      </h1>

      <div className="space-y-4">

        {trades.map((trade) => (

          <div
            key={trade.id}
            className="
            bg-slate-900
            border
            border-green-500/20
            rounded-xl
            p-5
            "
          >

            <p>
              <strong>
                Resource:
              </strong>
              {" "}
              {trade.resource}
            </p>

            <p>
              <strong>
                Amount:
              </strong>
              {" "}
              {trade.amount}
            </p>

            <p>
              <strong>
                Seller:
              </strong>
              {" "}
              {trade.sellerId}
            </p>

            <p>
              <strong>
                Buyer:
              </strong>
              {" "}
              {trade.buyerId}
            </p>

            <p className="text-gray-400">
              {new Date(
                trade.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Trades;