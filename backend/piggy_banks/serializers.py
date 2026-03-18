from rest_framework import serializers
from .models import PiggyBank, PiggyBankMovement


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


class PiggyBankMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiggyBankMovement
        fields = [
            "id",
            "movement_type",
            "amount",
            "balance_after",
            "created_at",
        ]
        read_only_fields = fields
