import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./InspectionHistory.css";

const API_URL =
  "http://127.0.0.1:8000/api/road-health/inspections/";

function InspectionHistory() {
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInspectionHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load AI inspection history.");
        }

        const data = await response.json();

        setInspections(data);
        setSelectedInspection(data[0] || null);
      } catch (err) {
        console.error("Inspection history error:", err);
        setError(
          "Unable to load inspection history. Check that Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInspectionHistory();
  }, []);

  const filteredInspections = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return inspections;
    }

    return inspections.filter((inspection) =>
      [
        inspection.inspection_id,
        inspection.road_id,
        inspection.road_name,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText))
    );
  }, [inspections, search]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();
  };

  const getHealthClass = (score) => {
    if (score >= 80) return "good";
    if (score >= 50) return "moderate";
    return "poor";
  };

  const getImageUrl = (url) => {
    if (!url) {
      return "";
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `http://127.0.0.1:8001${url.startsWith("/") ? url : `/${url}`}`;
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="history-content">
          <div className="history-heading">
            <h1>AI Inspection History</h1>
            <p>
              Review saved AI road inspections, detected defects, and health
              scores.
            </p>
          </div>

          <div className="history-filter-card">
            <div className="search-box">
              <label htmlFor="inspection-search">
                Search inspections
              </label>

              <input
                id="inspection-search"
                type="search"
                placeholder="Search by inspection ID, road ID or road name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <span className="record-count">
              {filteredInspections.length} Inspection
              {filteredInspections.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && (
            <div className="history-state">
              Loading AI inspection history...
            </div>
          )}

          {!loading && error && (
            <div className="history-state history-error">
              {error}
            </div>
          )}

          {!loading && !error && inspections.length === 0 && (
            <div className="history-state">
              <h2>No saved inspections yet</h2>
              <p>
                Complete an AI inspection and select “Save Inspection” to see
                it here.
              </p>
            </div>
          )}

          {!loading && !error && inspections.length > 0 && (
            <div className="inspection-history-grid">
              <section className="history-table-card">
                <div className="history-table-header">
                  <div>
                    <h2>Saved Inspections</h2>
                    <p>Select an inspection to see its detections.</p>
                  </div>
                </div>

                {filteredInspections.length === 0 ? (
                  <p className="no-history">
                    No inspections match your search.
                  </p>
                ) : (
                  <div className="history-table-container">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Inspection</th>
                          <th>Road</th>
                          <th>Detections</th>
                          <th>Health</th>
                          <th>Saved</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredInspections.map((inspection) => (
                          <tr
                            key={inspection.id}
                            className={
                              selectedInspection?.id === inspection.id
                                ? "selected-history-row"
                                : ""
                            }
                            onClick={() =>
                              setSelectedInspection(inspection)
                            }
                          >
                            <td>{inspection.inspection_id}</td>
                            <td>
                              <strong>{inspection.road_name}</strong>
                              <span className="road-id">
                                {inspection.road_id}
                              </span>
                            </td>
                            <td>{inspection.total_detections}</td>
                            <td>
                              <span
                                className={`health-score ${getHealthClass(
                                  inspection.health_score
                                )}`}
                              >
                                {inspection.health_score}/100
                              </span>
                            </td>
                            <td>{formatDate(inspection.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {selectedInspection && (
                <aside className="inspection-detail-card">
                  <h2>Inspection Details</h2>

                  <div className="detail-row">
                    <span>Inspection ID</span>
                    <strong>{selectedInspection.inspection_id}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Road</span>
                    <strong>
                      {selectedInspection.road_name} (
                      {selectedInspection.road_id})
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Image</span>
                    <strong>
                      {selectedInspection.image_filename || "Not available"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Detections</span>
                    <strong>{selectedInspection.total_detections}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Health score</span>
                    <strong>{selectedInspection.health_score}/100</strong>
                  </div>

                  <div className="detail-row">
                    <span>Saved</span>
                    <strong>
                      {formatDate(selectedInspection.created_at)}
                    </strong>
                  </div>

                  <h3>Detected Defects</h3>

                  {selectedInspection.detections?.length ? (
                    <ul className="detection-list">
                      {selectedInspection.detections.map(
                        (detection, index) => (
                          <li key={index}>
                            <strong>
                              {detection.damage_type || "Unknown defect"}
                            </strong>
                            {typeof detection.confidence === "number" && (
                              <span>
                                {(detection.confidence * 100).toFixed(1)}%
                                confidence
                              </span>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="no-detections">
                      No defects were detected for this inspection.
                    </p>
                  )}

                  {getImageUrl(selectedInspection.annotated_image_url) && (
                    <div className="annotated-history-image">
                      <h3>Annotated Image</h3>
                      <img
                        src={getImageUrl(
                          selectedInspection.annotated_image_url
                        )}
                        alt={`Annotated inspection for ${selectedInspection.road_name}`}
                      />
                    </div>
                  )}
                </aside>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default InspectionHistory;