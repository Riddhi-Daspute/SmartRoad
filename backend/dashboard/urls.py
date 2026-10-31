from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RoadHealthViewSet, save_ai_inspection

router = DefaultRouter()

router.register(
    r"",
    RoadHealthViewSet,
    basename="road-health"
)

urlpatterns = [
    path("inspections/save/", save_ai_inspection, name="save-ai-inspection"),
] + router.urls

