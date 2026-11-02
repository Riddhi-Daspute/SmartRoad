import uuid
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import RoadHealth
from .serializers import RoadHealthSerializer, AIInspectionSerializer
from .analytics import get_dashboard_summary
from django.db import transaction
from django.utils import timezone
from rest_framework import status

from .models import RoadHealth, AIInspection
from .decision_support import (
    calculate_road_health,
    determine_risk_level,
    determine_maintenance_priority,
)
from lifecycle.models import LifecycleEvent



class RoadHealthViewSet(viewsets.ModelViewSet):

    queryset = RoadHealth.objects.all().order_by(
        "-health_score"
    )

    serializer_class = RoadHealthSerializer


@api_view(["GET"])
def dashboard_summary(request):

    summary = get_dashboard_summary()

    return Response(summary)


@api_view(["POST"])
def save_ai_inspection(request):

    road_id = request.data.get("road_id")
    detections = request.data.get("detections")
    image_filename = request.data.get("image_filename", "")
    annotated_image_url = request.data.get("annotated_image_url", "")

    if not road_id:
        return Response(
            {"error": "road_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not isinstance(detections, list):
        return Response(
            {"error": "detections must be a list"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        road = RoadHealth.objects.get(road_id=road_id)
    except RoadHealth.DoesNotExist:
        return Response(
            {"error": "Road not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    inspection_id = f"AI-{uuid.uuid4().hex[:12].upper()}"

    try:
        with transaction.atomic():

            total_detections = len(detections)

            score = calculate_road_health(total_detections)

            inspection = AIInspection.objects.create(
                inspection_id=inspection_id,
                road_id=road.road_id,
                road_name=road.road_name,
                image_filename=image_filename,
                annotated_image_url=annotated_image_url,
                total_detections=total_detections,
                detections=detections,
                health_score=score,
            )

            road.health_score = score
            road.risk_level = determine_risk_level(score)
            road.maintenance_priority = (
                determine_maintenance_priority(score)
            )
            road.defect_count = total_detections
            road.save()

            LifecycleEvent.objects.create(
                road_id=road.road_id,
                road_name=road.road_name,
                event_type="INSPECTION",
                description=(
                    f"AI inspection {inspection_id} completed. "
                    f"{total_detections} detections recorded. "
                    f"Road health score: {score}/100."
                ),
                event_date=timezone.now(),
                performed_by="AI Inspection",
                reference_id=inspection_id,
            )

    except Exception:
        return Response(
            {"error": "Inspection could not be saved"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(
        {
            "message": "AI inspection saved successfully",
            "inspection_id": inspection.inspection_id,
            "road_id": road.road_id,
            "total_detections": inspection.total_detections,
            "health_score": road.health_score,
            "risk_level": road.risk_level,
            "maintenance_priority": road.maintenance_priority,
        },
        status=status.HTTP_201_CREATED
    )

@api_view(["GET"])
def ai_inspection_history(request):
    inspections = AIInspection.objects.all().order_by("-created_at")

    serializer = AIInspectionSerializer(inspections, many=True)

    return Response(serializer.data)
