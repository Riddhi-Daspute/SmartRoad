
import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AIInspection.css";

const CONFIDENCE_THRESHOLD = 0.5;

function AIInspection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roads, setRoads] = useState([]);
  const [selectedRoadId, setSelectedRoadId] = useState("");
  const [roadsLoading, setRoadsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const imageUrlRef = useRef(null);

  // Release the camera and preview URL when the page unmounts.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
  const loadRoads = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/road-health/"
      );

      if (!response.ok) {
        throw new Error("Could not load roads.");
      }

      const data = await response.json();

      setRoads(data);

      if (data.length > 0) {
        setSelectedRoadId(data[0].road_id);
      }
    } catch (err) {
      console.error("Road loading error:", err);
      setError(
        "Could not load roads from Django. Check that the backend is running."
      );
    } finally {
      setRoadsLoading(false);
    }
  };

  loadRoads();
}, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  const clearSelectedImage = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }

    setSelectedImage(null);
  };

  const selectImage = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please select a JPG or PNG image.");
      return;
    }

    clearSelectedImage();

    const imageUrl = URL.createObjectURL(file);
    imageUrlRef.current = imageUrl;

    setSelectedFile(file);
    setSelectedImage(imageUrl);
    setResult(null);
    setError("");
  };

  // Upload an image from the laptop.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      stopCamera();
      selectImage(file);
    }

    // Allows selecting the same file again.
    event.target.value = "";
  };

  // Start the laptop webcam.

const startCamera = async () => {
  setError("");

  if (!navigator.mediaDevices?.getUserMedia) {
    setError("Camera access is unavailable. Use localhost or HTTPS.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    streamRef.current = stream;

    const video = videoRef.current;

    if (!video) {
      throw new Error("Video element is not mounted.");
    }

    // Attach the stream to the existing video element.
    video.srcObject = stream;

    // Wait until the browser has camera metadata.
    await new Promise((resolve, reject) => {
      if (video.readyState >= 1) {
        resolve();
        return;
      }

      video.onloadedmetadata = resolve;
      video.onerror = () => reject(new Error("Video could not load."));
    });

    await video.play();
    setCameraActive(true);
    setError("");
  } catch (err) {
    console.error("Webcam initialization error:", err);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setCameraActive(false);
    setError(
      "Could not start the webcam. Check browser camera permission and try again."
    );
  }
};


  // Capture one photo from the live webcam.
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0) {
      setError("The webcam is not ready. Please wait and try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to capture the photo. Please try again.");
          return;
        }

        const file = new File(
          [blob],
          `smartroad-capture-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );

        stopCamera();
        selectImage(file);
      },
      "image/jpeg",
      0.92
    );
  };

  // Send either uploaded or captured image to the existing YOLO API.
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload an image or capture a photo first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8001/detect",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`AI server returned status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("AI detection error:", err);

      setError(
        "Unable to connect to the AI detection server. Check that FastAPI is running on port 8001."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInspection = async () => {
    if (!selectedRoadId) {
      setError("Please select a road first.");
      return;
    }

    if (!result || !Array.isArray(result.detections)) {
      setError("Analyze an image before saving the inspection.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/road-health/inspections/save/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            road_id: selectedRoadId,
            image_filename: selectedFile?.name || "road-inspection.jpg",
            annotated_image_url: result.annotated_image_url || "",
            detections: result.detections,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not save the inspection."
        );
      }

      setSaveMessage(
        `Inspection ${data.inspection_id} saved successfully. ` +
        `Road health: ${data.health_score}/100. ` +
        `${data.ignored_detections} low-confidence detection(s) ignored.`
      );
    } catch (err) {
      console.error("Inspection save error:", err);
      setError(err.message || "Unable to save the inspection.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    stopCamera();
    clearSelectedImage();

    setSelectedFile(null);
    setResult(null);
    setError("");
  };

  const acceptedDetections = result?.detections?.filter(
    (detection) =>
      typeof detection.confidence === "number" &&
      detection.confidence >= CONFIDENCE_THRESHOLD
  ) || [];

  const ignoredDetections = result?.detections?.filter(
    (detection) =>
      typeof detection.confidence !== "number" ||
      detection.confidence < CONFIDENCE_THRESHOLD
  ) || [];

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <main className="inspection-content">
          <div className="inspection-heading">
            <h1>AI Road Inspection</h1>
            <p>
              Upload a road image or capture one using your laptop webcam.
            </p>
          </div>

          <div className="inspection-grid">
            {/* Image upload and webcam */}
            <div className="inspection-card">
              <h2>Capture Road Image</h2>
              <div className="road-selection">
                <label htmlFor="inspection-road">
                  Select Road
                </label>

                <select
                  id="inspection-road"
                  value={selectedRoadId}
                  onChange={(event) =>
                    setSelectedRoadId(event.target.value)
                  }
                  disabled={roadsLoading || roads.length === 0}
                >
                  <option value="">
                    {roadsLoading ? "Loading roads..." : "Choose a road"}
                  </option>

                  {roads.map((road) => (
                    <option key={road.road_id} value={road.road_id}>
                      {road.road_id} - {road.road_name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="card-description">
                Upload an existing road image or use your webcam.
              </p>

              <label className="upload-area">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected road for inspection"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <p>Click to select a road image</p>
                    <span>JPG, JPEG or PNG</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  hidden
                />
              </label>


              <div className="camera-controls">
                <div
                  className="camera-preview"
                  style={{ display: cameraActive ? "block" : "none" }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    aria-label="Live webcam preview"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>

                {!cameraActive ? (
                  <button
                    type="button"
                    className="analyze-button"
                    onClick={startCamera}
                    disabled={loading}
                  >
                    Open Webcam
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="analyze-button"
                      onClick={capturePhoto}
                    >
                      Capture Photo
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={stopCamera}
                    >
                      Stop Camera
                    </button>
                  </>
                )}

                <canvas ref={canvasRef} hidden />
              </div>


              {selectedFile && (
                <button
                  type="button"
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={loading || cameraActive}
                >
                  {loading ? "Analyzing..." : "Analyze Road"}
                </button>
              )}

              {(selectedFile || result) && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset Inspection
                </button>
              )}
            </div>

            {/* Inspection results */}
            <div className="inspection-card">
              <h2>Inspection Result</h2>

              <p className="card-description">
                AI detection results will appear here.
              </p>

              {!result && !error && (
                <div className="result-placeholder">
                  <div className="result-icon">🔍</div>
                  <p>No inspection result yet</p>
                  <span>
                    Upload an image or capture a photo, then analyze it.
                  </span>
                </div>
              )}

              {error && (
                <div className="result-box">
                  <div className="result-status">{error}</div>
                </div>
              )}

              {result && (
                <div className="result-box">
                  <div className="result-item">
                    <span>AI Detections</span>
                    <strong>{result.detections?.length || 0}</strong>
                  </div>

                  <div className="assessment-summary">
                    <strong>
                      {acceptedDetections.length} accepted for assessment
                    </strong>
                    <span>
                      Confidence threshold: {CONFIDENCE_THRESHOLD * 100}%
                    </span>
                  </div>

                  {acceptedDetections.map((detection, index) => (
                    <div className="result-item" key={index}>
                      <span>Accepted defect {index + 1}</span>
                      <strong>
                        {detection.damage_type} ({(detection.confidence * 100).toFixed(2)}%)
                      </strong>
                    </div>
                  ))}

                  {ignoredDetections.length > 0 && (
                    <div className="ignored-detection">
                      {ignoredDetections.length} low-confidence detection(s)
                      will not affect the road health score.
                    </div>
                  )}

                  <div className="result-status">
                    AI analysis completed successfully
                  </div>

                  <button
                    type="button"
                    className="analyze-button"
                    onClick={handleSaveInspection}
                    disabled={saving || !selectedRoadId}
                  >
                    {saving ? "Saving Inspection..." : "Save Inspection"}
                  </button>

                  {saveMessage && (
                    <div className="result-status">
                      {saveMessage}
                    </div>
                  )}          

                  {result.annotated_image_url && (
                    <div className="annotated-result">
                      <h3>AI Annotated Image</h3>

                      <img
                        src={`http://127.0.0.1:8001${result.annotated_image_url}`}
                        alt="Road image annotated by YOLO"
                        className="image-preview"
                      />
                    </div>
                  )}
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
