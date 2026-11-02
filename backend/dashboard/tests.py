from django.test import TestCase
from .models import AIInspection, RoadHealth

from .decision_support import (
    calculate_inspection_health,
    calculate_road_health,
    determine_risk_level,
    determine_maintenance_priority,
    filter_reliable_detections,
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


class AIInspectionAssessmentTest(TestCase):

    def test_filters_low_confidence_predictions(self):
        accepted, ignored = filter_reliable_detections([
            {"damage_type": "pothole", "confidence": 0.90},
            {"damage_type": "crack", "confidence": 0.49},
        ])

        self.assertEqual(len(accepted), 1)
        self.assertEqual(len(ignored), 1)

    def test_weighted_inspection_health_score(self):
        score = calculate_inspection_health([
            {"damage_type": "pothole", "confidence": 0.90},
            {"damage_type": "waterlogging", "confidence": 0.80},
            {"damage_type": "crack", "confidence": 0.70},
        ])

        self.assertEqual(score, 35)

    def test_save_inspection_uses_reliable_weighted_detections(self):
        RoadHealth.objects.create(
            road_id="ROAD-003",
            road_name="Assessment Road",
        )

        response = self.client.post(
            "/api/road-health/inspections/save/",
            {
                "road_id": "ROAD-003",
                "image_filename": "assessment.jpg",
                "detections": [
                    {"damage_type": "pothole", "confidence": 0.90},
                    {"damage_type": "crack", "confidence": 0.40},
                    {"damage_type": "waterlogging", "confidence": 0.80},
                ],
            },
            content_type="application/json",
        )

        inspection = AIInspection.objects.get(
            inspection_id=response.data["inspection_id"]
        )
        road = RoadHealth.objects.get(road_id="ROAD-003")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total_detections"], 2)
        self.assertEqual(response.data["ignored_detections"], 1)
        self.assertEqual(response.data["health_score"], 45)
        self.assertEqual(inspection.total_detections, 2)
        self.assertEqual(len(inspection.detections), 2)
        self.assertEqual(road.health_score, 45)
