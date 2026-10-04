from rest_framework import serializers
from .models import Contractor
from .performance import calculate_performance_score


class ContractorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contractor
        fields = "__all__"

    def create(self, validated_data):

        score = calculate_performance_score(
            validated_data.get("total_projects", 0),
            validated_data.get("completed_projects", 0),
            validated_data.get("delayed_projects", 0),
            validated_data.get("repeat_defects", 0),
            validated_data.get("average_repair_time", 0)
        )

        validated_data["performance_score"] = score

        return Contractor.objects.create(**validated_data)

    def update(self, instance, validated_data):

        total_projects = validated_data.get(
            "total_projects",
            instance.total_projects
        )

        completed_projects = validated_data.get(
            "completed_projects",
            instance.completed_projects
        )

        delayed_projects = validated_data.get(
            "delayed_projects",
            instance.delayed_projects
        )

        repeat_defects = validated_data.get(
            "repeat_defects",
            instance.repeat_defects
        )

        average_repair_time = validated_data.get(
            "average_repair_time",
            instance.average_repair_time
        )

        score = calculate_performance_score(
            total_projects,
            completed_projects,
            delayed_projects,
            repeat_defects,
            average_repair_time
        )

        validated_data["performance_score"] = score

        return super().update(instance, validated_data)