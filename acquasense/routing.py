from dashboard.consumers import DashboardConsumer
from sensors.consumers import ConsumoConsumer, MonitoramentoEspecificoConsumer
from django.urls import re_path


websocket_urlpatterns = [
    re_path(r'ws/Dashboard/$', DashboardConsumer.as_asgi()),
    re_path(r'ws/consumo/$', ConsumoConsumer.as_asgi()),
    re_path(r'ws/monitoramento/$', MonitoramentoEspecificoConsumer.as_asgi()),
]

