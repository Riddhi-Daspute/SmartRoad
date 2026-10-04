from django.test import TestCase

from contractors.models import Contractor
from lifecycle.models import LifecycleEvent
from maintenance.models import Maintenance


class MaintenanceAPITest(TestCase):

    def test_maintenance_creation_creates_lifecycle_event(self):

        contractor = Contractor.objects.create(
            contractor_id="TESTC01",
            name="Test Contractor"
        )

        response = self.client.post(
            "/api/maintenance/",
            {
                "maintenance_id": "TESTM01",
                "road_id": "TESTR01",
                "road_name": "Test Road",
                "issue": "Pothole",
                "severity": "High",
                "priority": "HIGH",
                "status": "PENDING",
                "description": "Test maintenance task",
                "recommended_action": "Repair pothole",
                "contractor": contractor.id
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            Maintenance.objects.count(),
            1
        )

        self.assertEqual(
            LifecycleEvent.objects.count(),
            1
        )

        event = LifecycleEvent.objects.first()

        self.assertEqual(
            event.event_type,
            "MAINTENANCE"
        )

        self.assertEqual(
            event.reference_id,
            "TESTM01"
        )

    def test_completed_maintenance_creates_repair_event(self):

        contractor = Contractor.objects.create(
            contractor_id="TESTC02",
            name="Test Contractor 2"
        )

        maintenance = Maintenance.objects.create(
            maintenance_id="TESTM02",
            road_id="TESTR02",
            road_name="Test Road 2",
            issue="Road Crack",
            severity="Medium",
            priority="MEDIUM",
            status="PENDING",
            contractor=contractor
        )

        response = self.client.patch(
            f"/api/maintenance/{maintenance.id}/",
            {
                "status": "COMPLETED"
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        self.assertTrue(
            LifecycleEvent.objects.filter(
                event_type="REPAIR",
                reference_id="TESTM02"
            ).exists()
        )

    def test_verification_passed_creates_verification_event(self):

        contractor = Contractor.objects.create(
            contractor_id="TESTC03",
            name="Test Contractor 3"
        )

        maintenance = Maintenance.objects.create(
            maintenance_id="TESTM03",
            road_id="TESTR03",
            road_name="Test Road 3",
            issue="Pothole",
            severity="High",
            priority="HIGH",
            status="COMPLETED",
            contractor=contractor
        )

        response = self.client.patch(
            f"/api/maintenance/{maintenance.id}/",
            {
                "verification_status": "PASSED"
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        self.assertTrue(
            LifecycleEvent.objects.filter(
                event_type="VERIFICATION",
                reference_id="TESTM03"
            ).exists()
        )

    def test_verification_failed_creates_reinspection_event(self):

        contractor = Contractor.objects.create(
            contractor_id="TESTC04",
            name="Test Contractor 4"
        )

        maintenance = Maintenance.objects.create(
            maintenance_id="TESTM04",
            road_id="TESTR04",
            road_name="Test Road 4",
            issue="Surface Damage",
            severity="High",
            priority="HIGH",
            status="COMPLETED",
            contractor=contractor
        )

        response = self.client.patch(
            f"/api/maintenance/{maintenance.id}/",
            {
                "verification_status": "FAILED"
            },
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        self.assertTrue(
            LifecycleEvent.objects.filter(
                event_type="REINSPECTION",
                reference_id="TESTM04"
            ).exists()
        )