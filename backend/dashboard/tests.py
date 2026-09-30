from django.test import TestCase

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