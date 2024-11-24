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

class Notificacao(models.Model):
    TIPOS_NOTIFICACAO = [
        ('INFO', 'Informação'),
        ('ALERTA', 'Alerta'),
        ('ERRO', 'Erro'),
    ]
    
    titulo = models.TextField(default='Alerta')
    mensagem = models.TextField()
    data_hora = models.DateTimeField(auto_now_add=True)
    tipo_notificacao = models.CharField(max_length=50, choices=TIPOS_NOTIFICACAO)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notificacoes')
    lida = models.BooleanField(default=False)
    

    def __str__(self):
        return f"Notificação {self.get_tipo_notificacao_display()} para {self.usuario} em {self.data_hora}"

    class Meta:
        ordering = ['-data_hora']