import json
import asyncio
import logging
from django.db.models import Q
from django.db import models
from channels.generic.websocket import AsyncWebsocketConsumer
from alerts.models import Notificacao
from sensors.models import RegistroDeConsumo
from usuarios.models import CustomUser
from asgiref.sync import sync_to_async
from django.db.models import Sum
from datetime import datetime, timedelta
from django.utils import timezone

# Configuração básica do logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ConsumoConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.notification_sent_today = False  # Flag para controlar se a notificação foi enviada hoje

    async def connect(self):
        await self.accept()
        print("WebSocket conectado")

        # Inicia a tarefa de enviar registros a cada 10 segundos
        self.send_records_task = asyncio.create_task(self.send_records_periodically())

    async def disconnect(self, close_code):
        # Cancela a tarefa ao desconectar
        print(f"WebSocket desconectado: {close_code}")
        self.send_records_task.cancel()

    async def receive(self, text_data):
        print(f"Mensagem recebida: {text_data}")

    async def send_records_periodically(self):
        while True:
            try:
                percentual = await self.get_daily_percentage()
                accumulated = await self.get_accumulated_consumption()
                
                # Verifica se é um novo dia para resetar a flag
                await self.check_new_day()
                
                # Verifica se a porcentagem atingiu 5% e se ainda não foi enviada notificação hoje
                if percentual >= 50 and not self.notification_sent_today:
                    await self.send_notification(percentual)
                    self.notification_sent_today = True
                
                await self.send(text_data=json.dumps({
                    "type": "update",
                    "data": {
                        "percentual": percentual,
                        "acumulado_por_hora": accumulated,
                    }
                }))
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Erro: {e}")

    @sync_to_async
    def get_daily_percentage(self):
        limite_litros = 200
        inicio_do_dia = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        consumo_diario = RegistroDeConsumo.objects.filter(
            data_hora__gte=inicio_do_dia
        ).aggregate(total_consumo=Sum('consumo'))['total_consumo'] or 0

        porcentagem = (consumo_diario / limite_litros) * 100 if limite_litros else 0
        return float(round(porcentagem, 2))

    @sync_to_async
    def check_new_day(self):
        """Verifica se é um novo dia para resetar a flag de notificação"""
        hoje = timezone.now().date()
        ultima_notificacao = Notificacao.objects.filter(
            tipo_notificacao='ALERTA',
            titulo='Alerta de Consumo',
            data_hora__date__lt=hoje
        ).order_by('-data_hora').first()
        
        if ultima_notificacao:
            # Se a última notificação foi de um dia anterior, reseta a flag
            self.notification_sent_today = False

    @sync_to_async
    def send_notification(self, percentual):  
        try:
            # Obtém o usuário com ID 1 usando seu CustomUser
            usuario = CustomUser.objects.get(id=1)
            
            Notificacao.objects.create(
                titulo='Alerta de Consumo',
                mensagem=f'O consumo atingiu {percentual}% do limite diário',
                tipo_notificacao='ALERTA',
                usuario=usuario  # Usa sempre o CustomUser com ID 1
            )
        except CustomUser.DoesNotExist:
            logger.error("CustomUser com ID 1 não encontrado")
        except Exception as e:
            logger.error(f"Erro ao criar notificação: {str(e)}")
    
    @sync_to_async
    def get_accumulated_consumption(self):
        # Define o início do dia
        inicio_do_dia = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        # Obtém os registros de consumo do dia
        registros = RegistroDeConsumo.objects.filter(data_hora__gte=inicio_do_dia).order_by('data_hora')

        acumulado = 0
        acumulado_dict = {}

        # Agrupa os registros por hora e calcula o acumulado
        for registro in registros:
            # Subtrai 3 horas da data_hora do registro
            hora_ajustada = (registro.data_hora - timedelta(hours=3)).strftime('%H:%M')
            acumulado += registro.consumo
            acumulado_dict[hora_ajustada] = float(round(acumulado, 2))  # Armazena o acumulado até a hora

        print(acumulado_dict)
        return acumulado_dict
    