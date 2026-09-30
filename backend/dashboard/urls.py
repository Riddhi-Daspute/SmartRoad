from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import RoadHealthViewSet


router = DefaultRouter()

router.register(
    r"",
    RoadHealthViewSet,
    basename="road-health"
)

urlpatterns = router.urls