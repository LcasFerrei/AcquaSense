from dashboard.consumers import DashboardConsumer
from sensors.consumers import ConsumoConsumer
from django.urls import re_path


websocket_urlpatterns = [
    re_path(r'ws/Dashboard/$', DashboardConsumer.as_asgi()),
    re_path(r'ws/consumo/$', ConsumoConsumer.as_asgi()),
]
