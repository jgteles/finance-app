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
            "cdi_percentage",
            "last_cdi_accrual_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "balance", "last_cdi_accrual_date", "created_at", "updated_at"]

    def validate_cdi_percentage(self, value):
        if value is None:
            return value
        if value < 0 or value > 200:
            raise serializers.ValidationError("cdi_percentage must be between 0 and 200")
        return value


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
