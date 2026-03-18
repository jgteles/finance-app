from decimal import Decimal, InvalidOperation

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import PiggyBank, PiggyBankMovement
from .serializers import PiggyBankMovementSerializer, PiggyBankSerializer


class PiggyBankViewSet(viewsets.ModelViewSet):
    queryset = PiggyBank.objects.all()
    serializer_class = PiggyBankSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PiggyBank.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def _parse_amount(self, request) -> Decimal | None:
        raw = request.data.get("amount", None)
        if raw is None:
            return None
        try:
            return Decimal(str(raw))
        except (InvalidOperation, TypeError, ValueError):
            return None

    @action(detail=True, methods=["post"])
    def deposit(self, request, pk=None):
        amount = self._parse_amount(request)
        if amount is None or amount <= 0:
            return Response(
                {"error": "amount must be a positive number"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        piggy = self.get_object()
        with transaction.atomic():
            piggy.balance = piggy.balance + amount
            piggy.save(update_fields=["balance", "updated_at"])
            PiggyBankMovement.objects.create(
                piggy_bank=piggy,
                movement_type=PiggyBankMovement.MovementType.DEPOSIT,
                amount=amount,
                balance_after=piggy.balance,
            )

        return Response(self.get_serializer(piggy).data)

    @action(detail=True, methods=["post"])
    def withdraw(self, request, pk=None):
        amount = self._parse_amount(request)
        if amount is None or amount <= 0:
            return Response(
                {"error": "amount must be a positive number"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        piggy = self.get_object()
        next_balance = piggy.balance - amount
        if next_balance < 0:
            return Response(
                {"error": "insufficient balance"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            piggy.balance = next_balance
            piggy.save(update_fields=["balance", "updated_at"])
            PiggyBankMovement.objects.create(
                piggy_bank=piggy,
                movement_type=PiggyBankMovement.MovementType.WITHDRAW,
                amount=amount,
                balance_after=piggy.balance,
            )

        return Response(self.get_serializer(piggy).data)

    @action(detail=True, methods=["get"])
    def movements(self, request, pk=None):
        piggy = self.get_object()
        queryset = piggy.movements.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PiggyBankMovementSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = PiggyBankMovementSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"movements/(?P<movement_id>[^/.]+)",
    )
    def delete_movement(self, request, pk=None, movement_id=None):
        piggy = self.get_object()

        with transaction.atomic():
            piggy = PiggyBank.objects.select_for_update().get(pk=piggy.pk, user=request.user)

            movement = piggy.movements.filter(id=movement_id).first()
            if movement is None:
                return Response(
                    {"error": "movement not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            ordered = list(piggy.movements.order_by("created_at", "id").all())
            net = Decimal("0")
            for m in ordered:
                if m.movement_type == PiggyBankMovement.MovementType.DEPOSIT:
                    net += m.amount
                else:
                    net -= m.amount

            baseline = piggy.balance - net

            movement.delete()

            remaining = list(piggy.movements.order_by("created_at", "id").all())
            running_balance = baseline
            for m in remaining:
                if m.movement_type == PiggyBankMovement.MovementType.DEPOSIT:
                    running_balance += m.amount
                else:
                    running_balance -= m.amount

                if running_balance < 0:
                    return Response(
                        {
                            "error": "deleting this movement would result in negative balance due to later withdrawals"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                m.balance_after = running_balance

            if remaining:
                PiggyBankMovement.objects.bulk_update(remaining, ["balance_after"])

            piggy.balance = running_balance
            piggy.save(update_fields=["balance", "updated_at"])

        return Response(status=status.HTTP_204_NO_CONTENT)
