import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import "./InspectionChart.css";

function InspectionChart() {
  const data = [
    {
      month: "Jan",
      inspections: 45,
      defects: 12
    },
    {
      month: "Feb",
      inspections: 58,
      defects: 18
    },
    {
      month: "Mar",
      inspections: 72,
      defects: 25
    },
    {
      month: "Apr",
      inspections: 63,
      defects: 20
    },
    {
      month: "May",
      inspections: 85,
      defects: 31
    }
  ];

  return (
    <div className="chart-card">

      <h2>Inspection & Defect Trends</h2>

      <p className="chart-description">
        Monthly road inspections and detected defects.
      </p>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="inspections"
              name="Inspections"
              fill="#102a56"
            />

            <Bar
              dataKey="defects"
              name="Defects"
              fill="#f28c28"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default InspectionChart;