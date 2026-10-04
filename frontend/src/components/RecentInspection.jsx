import "./RecentInspection.css";

function RecentInspections() {
  const inspections = [
    {
      road: "College Road",
      defect: "Pothole",
      confidence: "94%",
      severity: "High",
      status: "Pending"
    },
    {
      road: "MG Road",
      defect: "Crack",
      confidence: "87%",
      severity: "Medium",
      status: "Assigned"
    },
    {
      road: "Station Road",
      defect: "Waterlogging",
      confidence: "91%",
      severity: "High",
      status: "In Progress"
    },
    {
      road: "Main Street",
      defect: "Pothole",
      confidence: "96%",
      severity: "Critical",
      status: "Pending"
    }
  ];

  return (
    <div className="recent-inspections">

      <div className="section-header">
        <div>
          <h2>Recent Inspections</h2>
          <p>Latest road defects detected by the system.</p>
        </div>

        <button className="view-all-button">
          View All
        </button>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Road</th>
              <th>Defect</th>
              <th>Confidence</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {inspections.map((inspection, index) => (
              <tr key={index}>

                <td>{inspection.road}</td>

                <td>{inspection.defect}</td>

                <td>{inspection.confidence}</td>

                <td>
                  <span
                    className={`severity ${inspection.severity.toLowerCase()}`}
                  >
                    {inspection.severity}
                  </span>
                </td>

                <td>
                  <span
                    className={`status ${inspection.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {inspection.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default RecentInspections;