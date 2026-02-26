from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('Receita', 'Receita'),
        ('Despesa', 'Despesa'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions"
        
    )

    date = models.DateField()
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.description} - {self.user.username}"