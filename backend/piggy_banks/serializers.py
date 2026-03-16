from rest_framework import serializers
from .models import PiggyBank


class PiggyBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiggyBank
        fields = [
            "id",
            "name",
            "color",
            "balance",
            "target_amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "balance", "created_at", "updated_at"]

