import json
import asyncio
import logging
from django.db.models import Q
from django.db import models
from channels.generic.websocket import AsyncWebsocketConsumer
from sensors.models import RegistroDeConsumo
from asgiref.sync import sync_to_async
from django.db.models import Sum
from datetime import datetime

# Configuração básica do logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ConsumoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # Inicia a tarefa de enviar registros a cada 10 segundos
        self.send_records_task = asyncio.create_task(self.send_records_periodically())

    async def disconnect(self, close_code):
        # Cancela a tarefa ao desconectar
        self.send_records_task.cancel()

    async def receive(self, text_data):
        # Você pode implementar a lógica de recebimento aqui, se necessário
        pass

    async def send_records_periodically(self):
        while True:
            registros = await self.get_consumption_records()
            await self.send(text_data=json.dumps({
                "type": "update",
                "data": registros
            }))
            await asyncio.sleep(1)  # Espera 10 segundos antes de enviar novamente

    @sync_to_async
    def get_consumption_records(self):
        # Consulta ao banco de dados para obter os 5 últimos registros de consumo
        registros = RegistroDeConsumo.objects.all().order_by('-data_hora')[:5]
        return [
            {
                "id": registro.id,
                "sensor": str(registro.sensor.identificador),  # Para exibir o nome do sensor
                "data_hora": str(registro.data_hora),
                "consumo": float(registro.consumo)  # Converte para float para facilitar o uso no frontend
            }
            for registro in registros
        ]
    
class MonitoramentoEspecificoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # Inicia as tarefas para envio periódico dos dados
        self.send_records_task = asyncio.create_task(self.send_records_periodically())
        self.send_daily_sum_task = asyncio.create_task(self.send_daily_sum())

    async def disconnect(self, close_code):
        # Cancela as tarefas ao desconectar
        self.send_records_task.cancel()
        self.send_daily_sum_task.cancel()

    async def send_records_periodically(self):
        while True:
            daily_consumption_sum = await self.get_daily_compartment_consumption()
            # print(f"Enviando dados de compartimento: {daily_consumption_sum}")  # Adicione um log aqui
            await self.send(text_data=json.dumps({
                "type": "compartment_sum",
                "data": daily_consumption_sum
            }))
            await asyncio.sleep(1)  # Intervalo de 1 segundo para atualizar os dados


    async def send_daily_sum(self):
        while True:
            daily_sum = await self.get_daily_consumption_sum()
            # print(f"Enviando dados de compartimento: {daily_sum}")  # Adicione um log aqui
            await self.send(text_data=json.dumps({
                "type": "daily_sum",
                "data": daily_sum
            }))
            await asyncio.sleep(1)  # Espera 1 segundo antes de enviar novamente

    @sync_to_async
    def get_daily_consumption_sum(self):
        today = datetime.now().date()
        consumo_diario = (
            RegistroDeConsumo.objects
            .filter(data_hora__date=today)
            .aggregate(total_consumo=Sum('consumo'))['total_consumo']
        )
        return {"day": today.strftime('%a'), "litros": float(consumo_diario) if consumo_diario else 0.0}
