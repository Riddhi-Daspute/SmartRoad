import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./InspectionHistory.css";

function InspectionHistory() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [lifecycleData, setLifecycleData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/lifecycle/")
      .then((response) => {
        setLifecycleData(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load lifecycle history.");
      });
  }, []);

  const filteredEvents = lifecycleData.filter((event) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      event.road_name.toLowerCase().includes(searchText) ||
      event.event_type.toLowerCase().includes(searchText) ||
      event.description.toLowerCase().includes(searchText);

    const matchesEvent =
      eventFilter === "All" ||
      event.event_type === eventFilter;

    return matchesSearch && matchesEvent;
  });

  const formatEventType = (eventType) => {
    const eventMap = {
      DEFECT: "Defect Detected",
      MAINTENANCE: "Maintenance",
      REPAIR: "Repair",
      VERIFICATION: "Verification",
      REINSPECTION: "Re-inspection",
    };

    return eventMap[eventType] || eventType;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="history-content">

          <div className="history-heading">
            <h1>Road Lifecycle History</h1>

            <p>
              Track defects, maintenance, repairs and verification events
              throughout the road lifecycle.
            </p>
          </div>

          {error && <p>{error}</p>}

          {/* Filters */}
          <div className="history-filter-card">

            <div className="search-box">
              <label>Search Lifecycle Event</label>

              <input
                type="text"
                placeholder="Search by road, event or description..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="history-filter">
              <label>Event Type</label>

              <select
                value={eventFilter}
                onChange={(event) =>
                  setEventFilter(event.target.value)
                }
              >
                <option value="All">
                  All Events
                </option>

                <option value="DEFECT">
                  Defect Detected
                </option>

                <option value="MAINTENANCE">
                  Maintenance
                </option>

                <option value="REPAIR">
                  Repair
                </option>

                <option value="VERIFICATION">
                  Verification
                </option>

                <option value="REINSPECTION">
                  Re-inspection
                </option>
              </select>
            </div>

          </div>

          {/* Lifecycle Table */}
          <div className="history-table-card">

            <div className="history-table-header">

              <div>
                <h2>Lifecycle Events</h2>

                <p>
                  Complete history of road condition and maintenance events.
                </p>
              </div>

              <span className="record-count">
                {filteredEvents.length} Records
              </span>

            </div>

            <div className="history-table-container">

              <table className="history-table">

                <thead>
                  <tr>
                    <th>Road</th>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Performed By</th>
                    <th>Reference</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEvents.map((event) => (

                    <tr key={event.id}>

                      <td>
                        {event.road_name}
                      </td>

                      <td>
                        <span
                          className={`history-status ${event.event_type
                            .toLowerCase()
                            .replace("_", "-")}`}
                        >
                          {formatEventType(event.event_type)}
                        </span>
                      </td>

                      <td>
                        {event.description}
                      </td>

                      <td>
                        {formatDate(event.event_date)}
                      </td>

                      <td>
                        {event.performed_by}
                      </td>

                      <td>
                        {event.reference_id || "N/A"}
                      </td>

                    </tr>

                  ))}

                  {filteredEvents.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="no-history"
                      >
                        No lifecycle events found.
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