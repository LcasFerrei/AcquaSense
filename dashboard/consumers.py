import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        # Teste de envio de mensagens após conectar
        await self.send(text_data=json.dumps({
            'news': "Atualização em tempo real: Conexão estabelecida!",
            'daily_consumption': "150 Litros",
            'pipes_status': "Em manutenção",
            'daily_goal': "120 Litros",
            'accumulated_consumption': "600 Litros"
        }))
