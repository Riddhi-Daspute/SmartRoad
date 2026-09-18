import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Maintenance.css";

function Maintenance() {
  const [filter, setFilter] = useState("All");

  const maintenanceData = [
    {
      road: "Main Street",
      defect: "Pothole",
      severity: "Critical",
      contractor: "ABC Road Works",
      date: "02 Sep 2026",
      status: "Pending",
    },
    {
      road: "Station Road",
      defect: "Crack",
      severity: "High",
      contractor: "City Infrastructure Ltd.",
      date: "01 Sep 2026",
      status: "Assigned",
    },
    {
      road: "MG Road",
      defect: "Waterlogging",
      severity: "Medium",
      contractor: "XYZ Contractors",
      date: "30 Aug 2026",
      status: "In Progress",
    },
    {
      road: "College Road",
      defect: "Surface Damage",
      severity: "Low",
      contractor: "ABC Road Works",
      date: "29 Aug 2026",
      status: "Completed",
    },
    {
      road: "Market Road",
      defect: "Pothole",
      severity: "High",
      contractor: "City Infrastructure Ltd.",
      date: "28 Aug 2026",
      status: "Pending",
    },
  ];

  const filteredData =
    filter === "All"
      ? maintenanceData
      : maintenanceData.filter((item) => item.status === filter);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="maintenance-content">

          <div className="maintenance-heading">
            <h1>Maintenance Management</h1>
            <p>
              Monitor road repairs, maintenance activities and their status.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="maintenance-summary">

            <div className="maintenance-card">
              <span>Pending</span>
              <strong>14</strong>
            </div>

            <div className="maintenance-card">
              <span>Assigned</span>
              <strong>8</strong>
            </div>

            <div className="maintenance-card">
              <span>In Progress</span>
              <strong>6</strong>
            </div>

            <div className="maintenance-card">
              <span>Completed</span>
              <strong>27</strong>
            </div>

          </div>

          {/* Maintenance Table */}
          <div className="maintenance-table-card">

            <div className="maintenance-table-header">

              <div>
                <h2>Maintenance Requests</h2>
                <p>
                  Track maintenance work generated from road inspections.
                </p>
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="status-filter"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

            </div>

            <div className="maintenance-table-container">

              <table className="maintenance-table">

                <thead>
                  <tr>
                    <th>Road</th>
                    <th>Defect</th>
                    <th>Severity</th>
                    <th>Contractor</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>

                      <td>{item.road}</td>

                      <td>{item.defect}</td>

                      <td>
                        <span
                          className={`maintenance-severity ${item.severity.toLowerCase()}`}
                        >
                          {item.severity}
                        </span>
                      </td>

                      <td>{item.contractor}</td>

                      <td>{item.date}</td>

                      <td>
                        <span
                          className={`maintenance-status ${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="view-button"
                          onClick={() =>
                            alert(
                              `${item.road}\n${item.defect}\n${item.severity}\n${item.status}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No maintenance requests found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Maintenance;