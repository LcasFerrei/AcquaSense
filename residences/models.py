from django.db import models
from usuarios.models import CustomUser

class Residencia(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    usuario = models.ForeignKey(
        CustomUser,
        related_name='user',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.nome

class PontoDeUsoDeAgua(models.Model):
    TIPOS_PONTO = [
        ('TORNEIRA', 'Torneira'),
        ('DUCHA', 'Ducha'),
        ('CHUVEIRO', 'Chuveiro'),
    ]
    
    nome = models.CharField(max_length=100)
    tipo_ponto = models.CharField(max_length=50, choices=TIPOS_PONTO)
    residencia = models.ForeignKey(Residencia, on_delete=models.CASCADE, related_name='pontos_uso_agua')

    def __str__(self):
        return f"{self.nome} - {self.get_tipo_ponto_display()}"