from rest_framework import serializers
from .models import Maintenance
from .lifecycle_service import create_lifecycle_event
from contractors.performance_service import (
    update_contractor_performance
)


class MaintenanceSerializer(serializers.ModelSerializer):

    contractor_name = serializers.CharField(
        source="contractor.name",
        read_only=True
    )

    class Meta:
        model = Maintenance
        fields = "__all__"

    def create(self, validated_data):

        expected_date = validated_data.get(
            "expected_completion_date"
        )

        completed_date = validated_data.get(
            "completed_date"
        )

        if expected_date and completed_date:
            validated_data["is_delayed"] = (
                completed_date > expected_date
            )

        maintenance = Maintenance.objects.create(
            **validated_data
        )

        # Automatically create lifecycle event
        create_lifecycle_event(
            maintenance,
            "MAINTENANCE",
            f"Maintenance task {maintenance.maintenance_id} "
            f"created for {maintenance.issue}."
        )

        return maintenance

    def update(self, instance, validated_data):

        # Store old values before updating
        old_status = instance.status
        old_verification_status = instance.verification_status

        expected_date = validated_data.get(
            "expected_completion_date",
            instance.expected_completion_date
        )

        completed_date = validated_data.get(
            "completed_date",
            instance.completed_date
        )

        if expected_date and completed_date:
            validated_data["is_delayed"] = (
                completed_date > expected_date
            )

        maintenance = super().update(
            instance,
            validated_data
        )

        # Repair completed
        if (
            old_status != "COMPLETED"
            and maintenance.status == "COMPLETED"
        ):

            performed_by = (
                maintenance.contractor.name
                if maintenance.contractor
                else "SmartRoad System"
            )

            create_lifecycle_event(
                maintenance,
                "REPAIR",
                f"Repair completed for maintenance task "
                f"{maintenance.maintenance_id}.",
                performed_by
            )

        # Verification passed
        if (
            old_verification_status != "PASSED"
            and maintenance.verification_status == "PASSED"
        ):

            create_lifecycle_event(
                maintenance,
                "VERIFICATION",
                f"Repair verified successfully for maintenance "
                f"task {maintenance.maintenance_id}."
            )

        # Verification failed
        if (
            old_verification_status != "FAILED"
            and maintenance.verification_status == "FAILED"
        ):

            create_lifecycle_event(
                maintenance,
                "REINSPECTION",
                f"Repair verification failed for maintenance "
                f"task {maintenance.maintenance_id}. Re-inspection required."
            )

        # Update contractor performance
        if maintenance.contractor:
            update_contractor_performance(
                maintenance.contractor.id
            )

        return maintenance