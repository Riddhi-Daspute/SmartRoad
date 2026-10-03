import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./RoadHealth.css";

function RoadHealth() {

  const [roads, setRoads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/road-health/")
      .then((response) => {
        setRoads(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load road health data.");
      });

  }, []);

  const goodRoads = roads.filter(
    (road) => road.risk_level === "LOW"
  ).length;

  const moderateRoads = roads.filter(
    (road) => road.risk_level === "MODERATE"
  ).length;

  const poorRoads = roads.filter(
    (road) => road.risk_level === "HIGH"
  ).length;

  const criticalRoads = roads.filter(
    (road) => road.risk_level === "CRITICAL"
  ).length;

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="road-health-content">

          <div className="road-health-heading">

            <h1>Road Health</h1>

            <p>
              Monitor the condition and health score of registered roads.
            </p>

          </div>

          {error && <p>{error}</p>}

          {/* Summary Cards */}

          <div className="health-summary">

            <div className="health-card good-card">
              <span>Good Roads</span>
              <strong>{goodRoads}</strong>
            </div>

            <div className="health-card moderate-card">
              <span>Moderate Roads</span>
              <strong>{moderateRoads}</strong>
            </div>

            <div className="health-card poor-card">
              <span>High Risk Roads</span>
              <strong>{poorRoads}</strong>
            </div>

            <div className="health-card critical-card">
              <span>Critical Roads</span>
              <strong>{criticalRoads}</strong>
            </div>

          </div>

          {/* Road Health Table */}

          <div className="road-health-table-card">

            <div className="table-heading">

              <div>

                <h2>Road Health Overview</h2>

                <p>
                  Health score and maintenance recommendations for each road.
                </p>

              </div>

            </div>

            <div className="health-table-container">

              <table className="health-table">

                <thead>

                  <tr>
                    <th>Road</th>
                    <th>Location</th>
                    <th>Health Score</th>
                    <th>Condition</th>
                    <th>Last Inspection</th>
                    <th>Recommended Action</th>
                  </tr>

                </thead>

                <tbody>

                  {roads.map((road) => (

                    <tr key={road.id}>

                      <td>{road.road_name}</td>

                      <td>{road.location || "Not available"}</td>

                      <td>

                        <div className="score-container">

                          <div className="score-bar">

                            <div
                              className="score-fill"
                              style={{
                                width: `${road.health_score}%`
                              }}
                            ></div>

                          </div>

                          <span>
                            {road.health_score}%
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`condition-badge ${road.risk_level.toLowerCase()}`}
                        >
                          {road.risk_level}
                        </span>

                      </td>

                      <td>
                        {road.last_updated
                          ? new Date(
                              road.last_updated
                            ).toLocaleDateString()
                          : "Not available"}
                      </td>

                      <td>
                        {road.recommended_action}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default RoadHealth;