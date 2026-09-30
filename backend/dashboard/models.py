from django.db import models


class RoadHealth(models.Model):

    RISK_CHOICES = [
        ("CRITICAL", "Critical"),
        ("HIGH", "High"),
        ("MODERATE", "Moderate"),
        ("LOW", "Low"),
    ]

    PRIORITY_CHOICES = [
        ("CRITICAL", "Critical"),
        ("HIGH", "High"),
        ("MEDIUM", "Medium"),
        ("LOW", "Low"),
    ]

    road_id = models.CharField(
        max_length=50,
        unique=True
    )

    road_name = models.CharField(
        max_length=200
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    health_score = models.PositiveIntegerField(
        default=100
    )

    risk_level = models.CharField(
        max_length=20,
        choices=RISK_CHOICES,
        default="LOW"
    )

    maintenance_priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="LOW"
    )

    defect_count = models.PositiveIntegerField(
        default=0
    )

    last_updated = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.road_id} - {self.road_name}"