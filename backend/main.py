from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from PIL import Image
from io import BytesIO
import uuid
import os
import numpy as np
import cv2

app = FastAPI(title="SmartRoad AI API")


# Model

MODEL_PATH = r"C:\SmartRoad\AI\runs\detect\train\weights\best.pt"

model = YOLO(MODEL_PATH)

CLASS_NAMES = {
    0: "crack",
    1: "pothole",
    2: "waterlogging"
}

# -----------------------------
# Results folder
# -----------------------------
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

# Serve saved result images
app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")


# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {
        "project": "SmartRoad",
        "status": "AI API is running",
        "model": "YOLO26n"
    }


# -----------------------------
# Detect road damage
# -----------------------------
@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    # Check file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    try:
        # Read uploaded image
        contents = await file.read()

        image = Image.open(BytesIO(contents)).convert("RGB")

        # Convert PIL image to numpy
        image_np = np.array(image)

        # YOLO prediction
        results = model(image_np)

        result = results[0]

        detections = []

        # -----------------------------
        # Extract detections
        # -----------------------------
        if result.boxes is not None:

            for box in result.boxes:

                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append({
                    "class_id": class_id,
                    "damage_type": CLASS_NAMES.get(
                        class_id,
                        "unknown"
                    ),
                    "confidence": round(confidence, 4),
                    "bounding_box": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2)
                    }
                })

        # -----------------------------
        # Create annotated image
        # -----------------------------
        annotated = result.plot()

        # YOLO returns BGR image
        annotated = cv2.cvtColor(
            annotated,
            cv2.COLOR_BGR2RGB
        )

        # Generate unique filename
        output_filename = f"{uuid.uuid4().hex}.jpg"

        output_path = os.path.join(
            RESULTS_DIR,
            output_filename
        )

        # Save image
        Image.fromarray(annotated).save(
            output_path,
            format="JPEG",
            quality=90
        )

        # URL for frontend
        annotated_image_url = (
            f"/results/{output_filename}"
        )

        # -----------------------------
        # Response
        # -----------------------------
        return {
            "filename": file.filename,
            "detections": detections,
            "total_detections": len(detections),
            "annotated_image_url": annotated_image_url
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(e)}"
        )