from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import RoadHealth
from .serializers import RoadHealthSerializer
from .analytics import get_dashboard_summary


class RoadHealthViewSet(viewsets.ModelViewSet):

    queryset = RoadHealth.objects.all().order_by(
        "-health_score"
    )

    serializer_class = RoadHealthSerializer


@api_view(["GET"])
def dashboard_summary(request):

    summary = get_dashboard_summary()

    return Response(summary)