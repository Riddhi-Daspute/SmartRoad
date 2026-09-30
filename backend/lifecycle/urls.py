from rest_framework.routers import DefaultRouter
from .views import LifecycleEventViewSet


router = DefaultRouter()

router.register(
    r"",
    LifecycleEventViewSet,
    basename="lifecycle"
)

urlpatterns = router.urls