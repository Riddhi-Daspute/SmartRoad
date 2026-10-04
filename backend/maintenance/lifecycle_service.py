from django.utils import timezone
from lifecycle.models import LifecycleEvent


def create_lifecycle_event(
    maintenance,
    event_type,
    description,
    performed_by="SmartRoad System"
):

    return LifecycleEvent.objects.create(

        road_id=maintenance.road_id,

        road_name=maintenance.road_name,

        event_type=event_type,

        description=description,

        event_date=timezone.now(),

        performed_by=performed_by,

        reference_id=maintenance.maintenance_id
    )