from rest_framework import viewsets
from .models import Contractor
from .serializers import ContractorSerializer


class ContractorViewSet(viewsets.ModelViewSet):

    queryset = Contractor.objects.all().order_by("-created_at")

    serializer_class = ContractorSerializer