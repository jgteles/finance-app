from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import PiggyBank


@dataclass(frozen=True)
class CdiAccrualResult:
    old_balance: Decimal
    new_balance: Decimal
    days_applied: int


def _get_cdi_daily_rate_percent() -> Decimal:
    value = getattr(settings, "CDI_DAILY_RATE_PERCENT", Decimal("0"))
    try:
        return Decimal(str(value))
    except Exception:
        return Decimal("0")


def _accrue_cdi_inplace(piggy: PiggyBank, as_of: date) -> CdiAccrualResult:
    last_date = piggy.last_cdi_accrual_date
    if last_date is None:
        piggy.last_cdi_accrual_date = as_of
        piggy.save(update_fields=["last_cdi_accrual_date", "updated_at"])
        return CdiAccrualResult(old_balance=piggy.balance, new_balance=piggy.balance, days_applied=0)

    days = (as_of - last_date).days
    if days <= 0:
        return CdiAccrualResult(old_balance=piggy.balance, new_balance=piggy.balance, days_applied=0)

    base_daily_rate = _get_cdi_daily_rate_percent() / Decimal("100")
    effective_rate = base_daily_rate * (piggy.cdi_percentage / Decimal("100"))

    old_balance = piggy.balance

    if effective_rate <= 0 or old_balance <= 0:
        piggy.last_cdi_accrual_date = as_of
        piggy.save(update_fields=["last_cdi_accrual_date", "updated_at"])
        return CdiAccrualResult(old_balance=old_balance, new_balance=old_balance, days_applied=days)

    factor = (Decimal("1") + effective_rate) ** days
    new_balance = (old_balance * factor).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    piggy.balance = new_balance
    piggy.last_cdi_accrual_date = as_of
    piggy.save(update_fields=["balance", "last_cdi_accrual_date", "updated_at"])

    return CdiAccrualResult(old_balance=old_balance, new_balance=new_balance, days_applied=days)


def accrue_cdi_for_piggy_locked(piggy: PiggyBank, *, as_of: date | None = None) -> CdiAccrualResult:
    target_date = as_of or timezone.localdate()
    return _accrue_cdi_inplace(piggy, target_date)


def accrue_cdi_for_piggy(piggy_id: int, *, user, as_of: date | None = None) -> PiggyBank:
    target_date = as_of or timezone.localdate()

    with transaction.atomic():
        piggy = PiggyBank.objects.select_for_update().get(id=piggy_id, user=user)
        _accrue_cdi_inplace(piggy, target_date)
        return piggy


def accrue_cdi_for_piggies(piggy_ids: list[int], *, user, as_of: date | None = None) -> list[PiggyBank]:
    if not piggy_ids:
        return []

    target_date = as_of or timezone.localdate()

    with transaction.atomic():
        locked = list(
            PiggyBank.objects.select_for_update()
            .filter(user=user, id__in=piggy_ids)
            .order_by("id")
        )
        locked_by_id = {p.id: p for p in locked}
        for pid in piggy_ids:
            piggy = locked_by_id.get(pid)
            if piggy is None:
                continue
            _accrue_cdi_inplace(piggy, target_date)

        return [locked_by_id[pid] for pid in piggy_ids if pid in locked_by_id]
