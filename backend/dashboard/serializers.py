from rest_framework import serializers
from .models import RoadHealth
from .decision_support import (
    calculate_road_health,
    determine_risk_level,
    determine_maintenance_priority,
    get_recommended_action
)


class RoadHealthSerializer(serializers.ModelSerializer):

    recommended_action = serializers.SerializerMethodField()

    class Meta:
        model = RoadHealth
        fields = "__all__"

    def create(self, validated_data):

        defect_count = validated_data.get("defect_count", 0)

        score = calculate_road_health(defect_count)

        validated_data["health_score"] = score
        validated_data["risk_level"] = determine_risk_level(score)
        validated_data["maintenance_priority"] = (
            determine_maintenance_priority(score)
        )

        return RoadHealth.objects.create(**validated_data)

    def update(self, instance, validated_data):

        defect_count = validated_data.get(
            "defect_count",
            instance.defect_count
        )

        score = calculate_road_health(defect_count)

        validated_data["health_score"] = score
        validated_data["risk_level"] = determine_risk_level(score)
        validated_data["maintenance_priority"] = (
            determine_maintenance_priority(score)
        )

        return super().update(instance, validated_data)

    def get_recommended_action(self, obj):

        return get_recommended_action(obj.health_score)