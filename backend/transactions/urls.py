from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExportFilteredExcelView, TransactionViewSet, UploadExcelView, RegisterView


router = DefaultRouter()
router.register(r"transactions", TransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("upload-excel/", UploadExcelView.as_view(), name="upload-excel"),
    path("export-filtered-excel/", ExportFilteredExcelView.as_view()),
    path("register/", RegisterView.as_view(), name="register"),
    ]

