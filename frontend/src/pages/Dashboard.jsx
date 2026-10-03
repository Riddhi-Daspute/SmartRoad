import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RiskChart from "../components/RiskChart";
import InspectionChart from "../components/InspectionChart";
import RecentInspections from "../components/RecentInspection";
import "./Dashboard.css";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/dashboard/summary/")
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load dashboard data.");
      });

  }, []);

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">

          <div className="welcome-section">

            <h1>SmartRoad Dashboard</h1>

            <p>
              Monitor road conditions, AI inspections and maintenance activities.
            </p>

          </div>

          {error && <p>{error}</p>}

          <div className="stats-grid">

            <StatCard
              title="Total Roads"
              value={summary ? summary.total_roads : "..."}
            />

            <StatCard
              title="Total Maintenance"
              value={summary ? summary.total_maintenance : "..."}
            />

            <StatCard
              title="High Risk Roads"
              value={summary ? summary.high_risk_roads : "..."}
            />

            <StatCard
              title="Pending Repairs"
              value={summary ? summary.pending_maintenance : "..."}
            />

          </div>

          <div className="dashboard-charts">

            <RiskChart />

            <InspectionChart />

          </div>

          <RecentInspections />

        </main>

      </div>

    </div>
  );
}

export default Dashboard;