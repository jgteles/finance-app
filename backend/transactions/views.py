from rest_framework import viewsets
from .models import Transaction
from .serializers import TransactionSerializer
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.http import HttpResponse
import openpyxl
from rest_framework import generics
from .serializers import RegisterSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UploadExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "Nenhum arquivo enviado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            df = pd.read_excel(file)

            for _, row in df.iterrows():
                Transaction.objects.create(
                    user=request.user,  # 👈 AQUI ESTÁ A CORREÇÃO
                    date=row["Data"],
                    description=row["Descrição"],
                    category=row["Categoria"],
                    value=row["Valor"],
                    type=row["Tipo"],
                )

            return Response(
                {"message": "Transações importadas com sucesso!"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class ExportFilteredExcelView(APIView):
    def post(self, request):
        transactions = request.data.get("transactions", [])
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Transações"

        ws.append(["Data", "Descrição", "Categoria", "Valor", "Tipo"])

        for t in transactions:
            ws.append([
                t["date"],
                t["description"],
                t["category"],
                float(t["value"]),
                t["type"],
            ])

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = "attachment; filename=transacoes.xlsx"

        wb.save(response)
        return response
    


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer