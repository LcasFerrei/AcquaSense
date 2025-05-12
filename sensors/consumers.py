import json
import asyncio
import logging
from django.db.models import Q
from django.db import models
from channels.generic.websocket import AsyncWebsocketConsumer
from sensors.models import RegistroDeConsumo
from asgiref.sync import sync_to_async
from django.db.models import Sum
from datetime import datetime, timedelta

# Configuração básica do logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
class ConsumoConsumer(AsyncWebsocketConsumer):
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
        # Lógica de recebimento de mensagens (se necessário)
        print(f"Mensagem recebida: {text_data}")

    async def send_records_periodically(self):
        while True:
            try:
                percentual = await self.get_daily_percentage()
                accumulated = await self.get_accumulated_consumption()
                await self.send(text_data=json.dumps({
                    "type": "update",
                    "data": {
                        "percentual": percentual,  # Enviar percentual como um objeto
                        "acumulado_por_hora": accumulated,  # Enviar percentual como um objeto
                    }
                }))
                await asyncio.sleep(1)  # Espera 1 segundo antes de enviar novamente
            except Exception as e:
                print(f"Erro: {e}")  # Captura e imprime qualquer erro

    @sync_to_async
    def get_daily_percentage(self):
        limite_litros = 200
        inicio_do_dia = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        consumo_diario = RegistroDeConsumo.objects.filter(
            data_hora__gte=inicio_do_dia
        ).aggregate(total_consumo=Sum('consumo'))['total_consumo'] or 0

        porcentagem = (consumo_diario / limite_litros) * 100 if limite_litros else 0
        return float(round(porcentagem, 2))  # Converte para float antes de retornar
    
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
    