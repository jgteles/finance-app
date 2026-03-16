from decimal import Decimal, InvalidOperation

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import PiggyBank
from .serializers import PiggyBankSerializer


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
        piggy.balance = piggy.balance + amount
        piggy.save(update_fields=["balance", "updated_at"])

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

        piggy.balance = next_balance
        piggy.save(update_fields=["balance", "updated_at"])

        return Response(self.get_serializer(piggy).data)

