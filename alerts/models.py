from django.db import models
from sensors.models import SensorDeFluxo
from usuarios.models import CustomUser

class AlertaConsumo(models.Model):
    TIPOS_ALERTA = [
        ('MÉDIO', 'Consumo quase excessivo'),
        ('EXCESSIVO', 'Consumo Excessivo'),
    ]
    
    mensagem = models.TextField()
    data_hora = models.DateTimeField(auto_now_add=True)
    tipo_alerta = models.CharField(max_length=50, choices=TIPOS_ALERTA)
    sensor = models.ForeignKey(SensorDeFluxo, on_delete=models.CASCADE, related_name='alertas')
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='alertas_consumo')

    def __str__(self):
        return f"Alerta {self.get_tipo_alerta_display()} em {self.data_hora}"
