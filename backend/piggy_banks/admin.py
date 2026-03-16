from django.contrib import admin

from .models import PiggyBank


@admin.register(PiggyBank)
class PiggyBankAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "balance", "target_amount", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "user__username")

