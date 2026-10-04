import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AIInspection.css";

function AIInspection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowResult(false);
    }
  };

  const handleAnalyze = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowResult(false);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="inspection-content">
          <div className="inspection-heading">
            <h1>AI Road Inspection</h1>
            <p>
              Upload a road image for AI-based defect detection.
            </p>
          </div>

          <div className="inspection-grid">

            {/* Upload Section */}
            <div className="inspection-card">
              <h2>Upload Road Image</h2>

              <p className="card-description">
                Select an image of a road to begin inspection.
              </p>

              <label className="upload-area">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected road"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>

                    <p>Click to select a road image</p>

                    <span>
                      JPG, JPEG or PNG
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                  hidden
                />
              </label>

              {selectedImage && !showResult && (
                <button
                  className="analyze-button"
                  onClick={handleAnalyze}
                >
                  Analyze Road
                </button>
              )}

              {showResult && (
                <button
                  className="analyze-button"
                  onClick={handleReset}
                >
                  Analyze Another Image
                </button>
              )}
            </div>


            {/* Result Section */}
            <div className="inspection-card">
              <h2>Inspection Result</h2>

              <p className="card-description">
                AI detection results will appear here.
              </p>

              {!showResult ? (
                <div className="result-placeholder">
                  <div className="result-icon">🔍</div>

                  <p>No inspection result yet</p>

                  <span>
                    Upload an image and analyze it to see results.
                  </span>
                </div>
              ) : (
                <div className="result-box">

                  <div className="result-item">
                    <span>Defect Detected</span>
                    <strong>Pothole</strong>
                  </div>

                  <div className="result-item">
                    <span>Confidence</span>
                    <strong>94%</strong>
                  </div>

                  <div className="result-item">
                    <span>Severity</span>
                    <strong className="severity-high">
                      HIGH
                    </strong>
                  </div>

                  <div className="result-item">
                    <span>Recommended Action</span>
                    <strong>
                      Immediate maintenance required
                    </strong>
                  </div>

                  <div className="result-status">
                    AI analysis completed successfully
                  </div>

                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default AIInspection;