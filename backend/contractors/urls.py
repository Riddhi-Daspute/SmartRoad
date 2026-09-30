from rest_framework.routers import DefaultRouter
from .views import ContractorViewSet


router = DefaultRouter()

router.register(
    r"",
    ContractorViewSet,
    basename="contractor"
)

urlpatterns = router.urls