import json
import asyncio
import logging
from django.db.models import Q
from django.db import models
from channels.generic.websocket import AsyncWebsocketConsumer
from alerts.models import Notificacao
from sensors.models import RegistroDeConsumo
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
        # Dicionário para controlar quais notificações já foram enviadas hoje
        self.notifications_sent_today = {
            50: False,
            80: False,
            100: False
        }

    async def connect(self):
        await self.accept()
        print("WebSocket conectado")
        self.send_records_task = asyncio.create_task(self.send_records_periodically())

    async def disconnect(self, close_code):
        print(f"WebSocket desconectado: {close_code}")
        self.send_records_task.cancel()

    async def receive(self, text_data):
        print(f"Mensagem recebida: {text_data}")

    async def send_records_periodically(self):
        while True:
            try:
                percentual = await self.get_daily_percentage()
                accumulated = await self.get_accumulated_consumption()
                
                # Verifica se é um novo dia para resetar as flags
                await self.check_new_day()
                
                # Verifica os limiares de notificação
                await self.check_notification_thresholds(percentual)
                
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
        """Verifica se é um novo dia para resetar as flags de notificação"""
        hoje = timezone.now().date()
        
        # Verifica se já existe alguma notificação de hoje
        has_notification_today = Notificacao.objects.filter(
            tipo_notificacao='ALERTA',
            data_hora__date=hoje
        ).exists()
        
        # Se não houver notificações hoje, reseta todas as flags
        if not has_notification_today:
            for threshold in self.notifications_sent_today:
                self.notifications_sent_today[threshold] = False

    async def check_notification_thresholds(self, percentual):
        """Verifica cada limiar e envia notificação se necessário"""
        thresholds = [50, 80, 100]
        
        for threshold in thresholds:
            if (percentual >= threshold and 
                not self.notifications_sent_today.get(threshold, True)):
                
                await self.send_notification(percentual, threshold)
                self.notifications_sent_today[threshold] = True

    @sync_to_async
    def send_notification(self, percentual, threshold):
        """Cria uma notificação no banco de dados"""
        # Get the actual user instance by awaiting .get_user()
        user = self.scope["user"].get_user()  # This resolves the lazy object
        
        messages = {
            50: f'O consumo atingiu 50% do limite diário ({percentual}%)',
            80: f'Alerta: consumo atingiu 80% do limite diário ({percentual}%)',
            100: f'ATENÇÃO: consumo atingiu 100% do limite diário ({percentual}%)'
        }
        
        Notificacao.objects.create(
            titulo=f'Alerta de Consumo ({threshold}%)',
            mensagem=messages[threshold],
            tipo_notificacao='ALERTA',
            usuario=user  # Now using the resolved user
        )
    
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
    