from django.db import models


class LifecycleEvent(models.Model):

    EVENT_TYPES = [
        ("CONSTRUCTION", "Construction"),
        ("INSPECTION", "Inspection"),
        ("DEFECT", "Defect Detected"),
        ("MAINTENANCE", "Maintenance"),
        ("REPAIR", "Repair"),
        ("VERIFICATION", "Verification"),
        ("REINSPECTION", "Re-inspection"),
    ]

    road_id = models.CharField(
        max_length=50
    )

    road_name = models.CharField(
        max_length=200
    )

    event_type = models.CharField(
        max_length=30,
        choices=EVENT_TYPES
    )

    description = models.TextField()

    event_date = models.DateTimeField()

    performed_by = models.CharField(
        max_length=150,
        blank=True
    )

    reference_id = models.CharField(
        max_length=50,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.road_id} - {self.event_type}"