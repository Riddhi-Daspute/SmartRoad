import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Maintenance.css";

function Maintenance() {

  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/maintenance/")
      .then((response) => {
        setMaintenanceData(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load maintenance data.");
      });

  }, []);

  const filteredData =
    filter === "All"
      ? maintenanceData
      : maintenanceData.filter(
          (item) => item.status === filter
        );

  const pendingCount = maintenanceData.filter(
    (item) => item.status === "PENDING"
  ).length;

  const assignedCount = maintenanceData.filter(
    (item) => item.status === "ASSIGNED"
  ).length;

  const inProgressCount = maintenanceData.filter(
    (item) => item.status === "IN_PROGRESS"
  ).length;

  const completedCount = maintenanceData.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const formatStatus = (status) => {

    const statusMap = {
      PENDING: "Pending",
      ASSIGNED: "Assigned",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      VERIFICATION: "Awaiting Verification",
      CLOSED: "Closed",
    };

    return statusMap[status] || status;
  };

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString();
  };

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

          {error && <p>{error}</p>}

          {/* Summary Cards */}

          <div className="maintenance-summary">

            <div className="maintenance-card">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>

            <div className="maintenance-card">
              <span>Assigned</span>
              <strong>{assignedCount}</strong>
            </div>

            <div className="maintenance-card">
              <span>In Progress</span>
              <strong>{inProgressCount}</strong>
            </div>

            <div className="maintenance-card">
              <span>Completed</span>
              <strong>{completedCount}</strong>
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

                <option value="All">
                  All Status
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="ASSIGNED">
                  Assigned
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="VERIFICATION">
                  Awaiting Verification
                </option>

                <option value="CLOSED">
                  Closed
                </option>

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

                  {filteredData.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {item.road_name}
                      </td>

                      <td>
                        {item.issue}
                      </td>

                      <td>

                        <span
                          className={`maintenance-severity ${item.severity.toLowerCase()}`}
                        >
                          {item.severity}
                        </span>

                      </td>

                      <td>
                        {item.contractor_name || "Not assigned"}
                      </td>

                      <td>
                        {formatDate(
                          item.expected_completion_date
                        )}
                      </td>

                      <td>

                        <span
                          className={`maintenance-status ${item.status
                            .toLowerCase()
                            .replace("_", "-")}`}
                        >
                          {formatStatus(item.status)}
                        </span>

                      </td>

                      <td>

                        <button
                          className="view-button"
                          onClick={() =>
                            alert(
                              `Road: ${item.road_name}\n` +
                              `Issue: ${item.issue}\n` +
                              `Severity: ${item.severity}\n` +
                              `Priority: ${item.priority}\n` +
                              `Status: ${formatStatus(item.status)}\n` +
                              `Contractor: ${
                                item.contractor_name || "Not assigned"
                              }`
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

                      <td
                        colSpan="7"
                        className="no-data"
                      >
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