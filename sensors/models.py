from django.db import models
from residences.models import PontoDeUsoDeAgua

class SensorDeFluxo(models.Model):
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]
    
    identificador = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='ATIVO')
    ponto_uso = models.ForeignKey(PontoDeUsoDeAgua, on_delete=models.CASCADE, related_name='sensores_fluxo')

    def __str__(self):
        return f"Sensor {self.identificador} - {self.get_status_display()}"

class RegistroDeConsumo(models.Model):
    sensor = models.ForeignKey(SensorDeFluxo, on_delete=models.CASCADE, related_name='registros_consumo')
    data_hora = models.DateTimeField(auto_now_add=True)
    consumo = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.consumo}L em {self.data_hora}"
