from django.test import TestCase


class ContractorAPITest(TestCase):

    def test_contractor_api_create(self):

        response = self.client.post(
            "/api/contractors/",
            {
                "contractor_id": "TEST001",
                "name": "Test Contractor",
                "company": "Test Infrastructure",
                "total_projects": 10,
                "completed_projects": 8,
                "delayed_projects": 2,
                "repeat_defects": 1,
                "average_repair_time": 5
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            response.data["performance_score"],
            80
        )