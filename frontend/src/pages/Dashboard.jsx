import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RiskChart from "../components/RiskChart";
import InspectionChart from "../components/InspectionChart";
import RecentInspections from "../components/RecentInspection";
import "./Dashboard.css";

function Dashboard() {
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

          <div className="stats-grid">

            <StatCard
              title="Total Roads"
              value="125"
            />

            <StatCard
              title="Total Inspections"
              value="348"
            />

            <StatCard
              title="High Risk Roads"
              value="21"
            />

            <StatCard
              title="Pending Repairs"
              value="14"
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