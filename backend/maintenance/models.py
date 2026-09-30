from django.db import models
from contractors.models import Contractor


class Maintenance(models.Model):

    PRIORITY_CHOICES = [
        ("CRITICAL", "Critical"),
        ("HIGH", "High"),
        ("MEDIUM", "Medium"),
        ("LOW", "Low"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ASSIGNED", "Assigned"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
        ("VERIFICATION", "Awaiting Verification"),
        ("CLOSED", "Closed"),
    ]

    maintenance_id = models.CharField(
        max_length=20,
        unique=True
    )

    road_id = models.CharField(
        max_length=50
    )

    road_name = models.CharField(
        max_length=200
    )

    issue = models.CharField(
        max_length=255
    )

    severity = models.CharField(
        max_length=50
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="MEDIUM"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    description = models.TextField(
        blank=True
    )

    recommended_action = models.TextField(
        blank=True
    )

    contractor = models.ForeignKey(
        Contractor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_tasks"
    )

    assigned_date = models.DateField(
        null=True,
        blank=True
    )

    expected_completion_date = models.DateField(
        null=True,
        blank=True
    )

    completed_date = models.DateField(
        null=True,
        blank=True
    )

    verification_status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("PASSED", "Passed"),
            ("FAILED", "Failed"),
        ],
        default="PENDING"
    )

    is_delayed = models.BooleanField(
        default=False
    )

    repeat_defect = models.BooleanField(
        default=False
    )

    verification_notes = models.TextField(
        blank=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.maintenance_id} - {self.road_name}"