from rest_framework import viewsets
from .models import LifecycleEvent
from .serializers import LifecycleEventSerializer


class LifecycleEventViewSet(viewsets.ModelViewSet):

    queryset = LifecycleEvent.objects.all().order_by(
        "-event_date"
    )

    serializer_class = LifecycleEventSerializer