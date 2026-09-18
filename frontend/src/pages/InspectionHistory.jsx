import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./InspectionHistory.css";

function InspectionHistory() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  const inspections = [
    {
      road: "College Road",
      defect: "Pothole",
      confidence: "94%",
      severity: "High",
      date: "02 Sep 2026",
      source: "AI Camera",
      status: "Reviewed",
    },
    {
      road: "MG Road",
      defect: "Crack",
      confidence: "87%",
      severity: "Medium",
      date: "01 Sep 2026",
      source: "Manual Upload",
      status: "Reviewed",
    },
    {
      road: "Station Road",
      defect: "Waterlogging",
      confidence: "91%",
      severity: "High",
      date: "30 Aug 2026",
      source: "AI Camera",
      status: "Pending",
    },
    {
      road: "Main Street",
      defect: "Pothole",
      confidence: "96%",
      severity: "Critical",
      date: "29 Aug 2026",
      source: "AI Camera",
      status: "Reviewed",
    },
    {
      road: "Market Road",
      defect: "Surface Damage",
      confidence: "82%",
      severity: "Low",
      date: "28 Aug 2026",
      source: "Manual Upload",
      status: "Reviewed",
    },
    {
      road: "Nashik Road",
      defect: "Crack",
      confidence: "89%",
      severity: "Medium",
      date: "27 Aug 2026",
      source: "AI Camera",
      status: "Pending",
    },
  ];

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.road.toLowerCase().includes(search.toLowerCase()) ||
      inspection.defect.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severityFilter === "All" ||
      inspection.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="history-content">

          <div className="history-heading">
            <h1>Inspection History</h1>
            <p>
              View previous AI and manual road inspections.
            </p>
          </div>

          {/* Filters */}
          <div className="history-filter-card">

            <div className="search-box">
              <label>Search Inspection</label>

              <input
                type="text"
                placeholder="Search by road or defect..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="history-filter">
              <label>Severity</label>

              <select
                value={severityFilter}
                onChange={(event) =>
                  setSeverityFilter(event.target.value)
                }
              >
                <option value="All">All Severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

          </div>

          {/* History Table */}
          <div className="history-table-card">

            <div className="history-table-header">
              <div>
                <h2>Inspection Records</h2>
                <p>
                  Complete record of road condition inspections.
                </p>
              </div>

              <span className="record-count">
                {filteredInspections.length} Records
              </span>
            </div>

            <div className="history-table-container">

              <table className="history-table">

                <thead>
                  <tr>
                    <th>Road</th>
                    <th>Defect</th>
                    <th>Confidence</th>
                    <th>Severity</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInspections.map((inspection, index) => (
                    <tr key={index}>

                      <td>{inspection.road}</td>

                      <td>{inspection.defect}</td>

                      <td className="confidence">
                        {inspection.confidence}
                      </td>

                      <td>
                        <span
                          className={`history-severity ${inspection.severity.toLowerCase()}`}
                        >
                          {inspection.severity}
                        </span>
                      </td>

                      <td>{inspection.date}</td>

                      <td>{inspection.source}</td>

                      <td>
                        <span
                          className={`history-status ${inspection.status.toLowerCase()}`}
                        >
                          {inspection.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                  {filteredInspections.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-history">
                        No inspection records found.
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

export default InspectionHistory;