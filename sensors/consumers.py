import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from sensors.models import RegistroDeConsumo
from asgiref.sync import sync_to_async

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
            await asyncio.sleep(10)  # Espera 10 segundos antes de enviar novamente

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
