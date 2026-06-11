import Layout from "../components/Layout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Analytics() {

  const data = [
    { year: 1000, population: 150 },
    { year: 1500, population: 400 },
    { year: 2000, population: 1200 },
    { year: 2500, population: 2800 },
    { year: 3000, population: 4500 },
    { year: 3500, population: 7000 },
  ];

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
        Analytics
      </h1>

      <div
        className="
        bg-slate-900
        p-6
        rounded-xl
        border
        border-cyan-500/20
      "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-6
        "
        >
          Population Growth
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="year" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="population"
              stroke="#22d3ee"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </Layout>
  );
}

export default Analytics;