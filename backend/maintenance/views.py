from rest_framework import viewsets
from .models import Maintenance
from .serializers import MaintenanceSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):

    queryset = Maintenance.objects.select_related(
        "contractor"
    ).all().order_by("-created_at")

    serializer_class = MaintenanceSerializer