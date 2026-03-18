from django.db import models
from django.contrib.auth.models import User


class PiggyBank(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="piggy_banks",
    )

    name = models.CharField(max_length=120)
    color = models.CharField(max_length=16, default="#22c55e")

    # Current saved amount in this piggy bank.
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Optional target amount for goal tracking.
    target_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.user.username})"


class PiggyBankMovement(models.Model):
    class MovementType(models.TextChoices):
        DEPOSIT = "DEPOSIT", "Deposit"
        WITHDRAW = "WITHDRAW", "Withdraw"

    piggy_bank = models.ForeignKey(
        PiggyBank,
        on_delete=models.CASCADE,
        related_name="movements",
    )

    movement_type = models.CharField(max_length=16, choices=MovementType.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self) -> str:
        return f"{self.piggy_bank.name} {self.movement_type} {self.amount}"
