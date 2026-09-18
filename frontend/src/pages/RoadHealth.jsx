import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./RoadHealth.css";

function RoadHealth() {
  const roads = [
    {
      name: "College Road",
      location: "Mumbai",
      score: 88,
      condition: "Good",
      inspection: "02 Sep 2026",
      action: "Regular Monitoring",
    },
    {
      name: "MG Road",
      location: "Mumbai",
      score: 67,
      condition: "Moderate",
      inspection: "01 Sep 2026",
      action: "Schedule Inspection",
    },
    {
      name: "Station Road",
      location: "Mumbai",
      score: 42,
      condition: "Poor",
      inspection: "30 Aug 2026",
      action: "Maintenance Required",
    },
    {
      name: "Main Street",
      location: "Mumbai",
      score: 24,
      condition: "Critical",
      inspection: "29 Aug 2026",
      action: "Immediate Repair",
    },
  ];

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

          {/* Summary Cards */}
          <div className="health-summary">

            <div className="health-card good-card">
              <span>Good Roads</span>
              <strong>58</strong>
            </div>

            <div className="health-card moderate-card">
              <span>Moderate Roads</span>
              <strong>32</strong>
            </div>

            <div className="health-card poor-card">
              <span>Poor Roads</span>
              <strong>21</strong>
            </div>

            <div className="health-card critical-card">
              <span>Critical Roads</span>
              <strong>14</strong>
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
                  {roads.map((road, index) => (
                    <tr key={index}>

                      <td>{road.name}</td>

                      <td>{road.location}</td>

                      <td>
                        <div className="score-container">
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{ width: `${road.score}%` }}
                            ></div>
                          </div>

                          <span>{road.score}%</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`condition-badge ${road.condition.toLowerCase()}`}
                        >
                          {road.condition}
                        </span>
                      </td>

                      <td>{road.inspection}</td>

                      <td>{road.action}</td>

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