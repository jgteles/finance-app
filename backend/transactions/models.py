from django.db import models

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('Receita', 'Receita'),
        ('Despesa', 'Despesa'),
    ]

    date = models.DateField()
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self.description
