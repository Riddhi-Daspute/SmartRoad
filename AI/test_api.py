import requests
import os

API_URL = "http://127.0.0.1:8000/detect"

TEST_IMAGES = [
    {
        "path": r"C:\SmartRoad\AI\dataset\images\test\China_Drone_000030.jpg",
        "expected": "crack"
    },
    {
        "path": r"C:\SmartRoad\AI\dataset\images\test\China_MotorBike_000007.jpg",
        "expected": "pothole"
    },
    {
        "path": r"C:\SmartRoad\AI\dataset\images\test\water_waterloggingt-142-_jpg.rf.6fa85ace01cb5e13d1072380359583f1.jpg",
        "expected": "waterlogging"
    }
]

print("=" * 70)
print("SMARTROAD AI API MULTI-IMAGE TEST")
print("=" * 70)

passed = 0
failed = 0

for test in TEST_IMAGES:

    image_path = test["path"]
    expected = test["expected"]
    filename = os.path.basename(image_path)

    print("\n" + "-" * 70)
    print(f"Testing: {filename}")
    print(f"Expected class: {expected}")

    if not os.path.exists(image_path):
        print("ERROR: Image not found")
        failed += 1
        continue

    try:
        with open(image_path, "rb") as image_file:

            response = requests.post(
                API_URL,
                files={
                    "file": (
                        filename,
                        image_file,
                        "image/jpeg"
                    )
                },
                timeout=120
            )

        print("Status Code:", response.status_code)

        if response.status_code != 200:
            print("API ERROR:")
            print(response.text)
            failed += 1
            continue

        data = response.json()

        print("Total Detections:", data["total_detections"])

        detected_classes = []

        for detection in data["detections"]:

            damage_type = detection["damage_type"]
            confidence = detection["confidence"]

            detected_classes.append(damage_type)

            print(
                f"  - {damage_type}"
                f" | Confidence: {confidence}"
            )

        print(
            "Annotated Image:",
            data["annotated_image_url"]
        )

        # Check whether expected class was detected
        if expected in detected_classes:

            print(f"RESULT: PASS - {expected} detected")
            passed += 1

        else:

            print(f"RESULT: FAIL - {expected} not detected")
            failed += 1

    except requests.exceptions.ConnectionError:

        print("ERROR: Could not connect to FastAPI.")
        print("Make sure Uvicorn is running.")
        failed += 1

    except Exception as e:

        print("ERROR:", e)
        failed += 1


print("\n" + "=" * 70)
print("FINAL TEST SUMMARY")
print("=" * 70)

print("Total Tests :", len(TEST_IMAGES))
print("Passed      :", passed)
print("Failed      :", failed)

if failed == 0:
    print("OVERALL RESULT: ALL TESTS PASSED")
else:
    print("OVERALL RESULT: SOME TESTS FAILED")

print("=" * 70)