from django.db import models


class Contractor(models.Model):

    contractor_id = models.CharField(
        max_length=20,
        unique=True
    )

    name = models.CharField(
        max_length=150
    )

    company = models.CharField(
        max_length=200,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    total_projects = models.PositiveIntegerField(
        default=0
    )

    completed_projects = models.PositiveIntegerField(
        default=0
    )

    delayed_projects = models.PositiveIntegerField(
        default=0
    )

    repeat_defects = models.PositiveIntegerField(
        default=0
    )

    average_repair_time = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )

    performance_score = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.contractor_id} - {self.name}"