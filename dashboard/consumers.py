import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db.models import Sum
from datetime import datetime, timedelta
from sensors.models import RegistroDeConsumo,SensorDeFluxo

class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.send_records_task = asyncio.create_task(self.send_records_consumption())

    async def send_records_consumption(self):
        while True:
            try:
                accumulated = await self.get_daily_consumption()
                consumption_by_point = await self.get_accumulated_consumption_by_point()
                await self.send(text_data=json.dumps({
                    'news': (
                        "Bem-vindo ao AcquaSense! Acompanhe o consumo diário da sua residência, "
                        "estabeleça metas e veja dicas para melhorar sua eficiência hídrica. "
                        "Lembre-se: cada gota conta!"
                    ),
                    'daily_consumption': f"{accumulated} Litros",
                    'pipes_status': "Em manutenção",
                    'daily_goal': "120 Litros",
                    'accumulated_consumption': consumption_by_point
                }))
                await asyncio.sleep(1)  # Espera 1 segundo antes de enviar novamente
            except Exception as e:
                print(f"Erro: {e}")  # Captura e imprime qualquer erro

    @sync_to_async
    def get_daily_consumption(self):
        inicio_do_dia = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        consumo_diario = RegistroDeConsumo.objects.filter(
            data_hora__gte=inicio_do_dia
        ).aggregate(total_consumo=Sum('consumo'))['total_consumo'] or 0
        return float(consumo_diario)

    @sync_to_async
    def get_accumulated_consumption_by_point(self):
        inicio_do_dia = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        registros_consumo = RegistroDeConsumo.objects.filter(data_hora__gte=inicio_do_dia)

        # Calcula o consumo total
        consumo_total = registros_consumo.aggregate(total=Sum('consumo'))['total'] or 0
        consumo_total = float(consumo_total)  # Converte Decimal para float

        consumo_por_ponto = {}
        for sensor in SensorDeFluxo.objects.select_related('ponto_uso').all():
            consumo_sensor = registros_consumo.filter(sensor=sensor).aggregate(total=Sum('consumo'))['total'] or 0
            consumo_sensor = float(consumo_sensor)  # Converte Decimal para float
            ponto_uso_nome = sensor.ponto_uso.nome
            consumo_por_ponto[ponto_uso_nome] = {
                'consumo': round(consumo_sensor, 2),
                'porcentagem': (round(consumo_sensor / consumo_total * 100, 2)) if consumo_total > 0 else 0
            }

        return consumo_por_ponto
