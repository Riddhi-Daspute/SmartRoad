import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import "./RiskChart.css";

function RiskChart() {
  const data = [
    { name: "Low", value: 45 },
    { name: "Medium", value: 35 },
    { name: "High", value: 15 },
    { name: "Critical", value: 5 }
  ];

  const COLORS = ["#2e8b57", "#f2b705", "#f28c28", "#d62828"];

  return (
    <div className="chart-card">

      <h2>Road Risk Distribution</h2>

      <p className="chart-description">
        Distribution of roads according to their calculated risk level.
      </p>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default RiskChart;