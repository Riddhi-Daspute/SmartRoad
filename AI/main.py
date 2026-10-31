
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "runs" / "detect" / "train" / "weights" / "best.pt"
RESULTS_DIR = BASE_DIR / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"YOLO model not found: {MODEL_PATH}")

app = FastAPI(title="SmartRoad AI Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/results", StaticFiles(directory=str(RESULTS_DIR)), name="results")

model = YOLO(str(MODEL_PATH))


@app.get("/")
def home():
    return {"message": "SmartRoad AI API is running"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image.")

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")     

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Maximum image size is 10 MB.")

    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    extension = Path(file.filename or "").suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Supported formats: JPG, JPEG, PNG, and WEBP.",
        )

    import cv2
    import numpy as np

    image_array = cv2.imdecode(
        np.frombuffer(contents, dtype=np.uint8),
        cv2.IMREAD_COLOR,
    )

    if image_array is None:
        raise HTTPException(status_code=400, detail="Could not read the image.")

    try:
        predictions = model.predict(image_array, verbose=False)
        prediction = predictions[0]

        result_filename = f"{uuid4().hex}.jpg"
        result_path = RESULTS_DIR / result_filename

        if not cv2.imwrite(str(result_path), prediction.plot()):
            raise HTTPException(status_code=500, detail="Could not save annotated image.")

        detections = []

        if prediction.boxes is not None:
            for box in prediction.boxes:
                class_id = int(box.cls.item())
                class_name = model.names.get(class_id, str(class_id))
                confidence = float(box.conf.item())
                coordinates = box.xyxy[0].tolist()

                detections.append(
                    {
                        "class_id": class_id,
                        "damage_type": str(class_name),
                        "confidence": round(confidence, 4),
                        "bounding_box": [round(float(v), 2) for v in coordinates],
                    }
                )

        return {
            "filename": file.filename,
            "total_detections": len(detections),
            "detections": detections,
            "annotated_image_url": f"/results/{result_filename}",
        }

    finally:
        await file.close()
