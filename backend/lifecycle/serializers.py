from rest_framework import serializers
from .models import LifecycleEvent


class LifecycleEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = LifecycleEvent
        fields = "__all__"