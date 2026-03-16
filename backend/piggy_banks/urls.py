from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PiggyBankViewSet


router = DefaultRouter()
router.register(r"piggy-banks", PiggyBankViewSet, basename="piggy-banks")

urlpatterns = [
    path("", include(router.urls)),
]

