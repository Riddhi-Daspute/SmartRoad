from django.test import TestCase
from .models import AIInspection

from .decision_support import (
    calculate_road_health,
    determine_risk_level,
    determine_maintenance_priority,
)


class RoadHealthTest(TestCase):

    def test_road_health_calculation(self):

        score = calculate_road_health(3)

        self.assertEqual(score, 70)

    def test_risk_level(self):

        risk = determine_risk_level(40)

        self.assertEqual(risk, "HIGH")

    def test_maintenance_priority(self):

        priority = determine_maintenance_priority(60)

        self.assertEqual(priority, "MEDIUM")

    def test_road_health_api_create(self):
        
        response = self.client.post(
            "/api/road-health/",
            {
                "road_id": "TEST001",
                "road_name": "Test Road",
                "location": "Pune",
                "defect_count": 3
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            response.data["health_score"],
            70
        )

        self.assertEqual(
            response.data["risk_level"],
            "MODERATE"
        )

        self.assertEqual(
            response.data["maintenance_priority"],
            "MEDIUM"
        )

class AIInspectionHistoryTest(TestCase):

    def test_ai_inspection_history_returns_newest_inspections_first(self):
        older = AIInspection.objects.create(
            inspection_id="AI-OLDER",
            road_id="ROAD-001",
            road_name="Old Road",
            image_filename="old.jpg",
            total_detections=1,
            detections=[],
            health_score=90,
        )

        newer = AIInspection.objects.create(
            inspection_id="AI-NEWER",
            road_id="ROAD-002",
            road_name="New Road",
            image_filename="new.jpg",
            annotated_image_url="/outputs/new.jpg",
            total_detections=2,
            detections=[
                {
                    "damage_type": "pothole",
                    "confidence": 0.91,
                }
            ],
            health_score=80,
        )

        response = self.client.get(
            "/api/road-health/inspections/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(
            response.data[0]["inspection_id"],
            newer.inspection_id,
        )
        self.assertEqual(
            response.data[1]["inspection_id"],
            older.inspection_id,
        )
