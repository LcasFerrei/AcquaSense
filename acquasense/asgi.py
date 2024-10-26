# seu_projeto/asgi.py
import os
import django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'acquasense.settings')
django.setup()

from dashboard.consumers import DashboardConsumer
from sensors.consumers import ConsumoConsumer

# Definindo as rotas WebSocket
websocket_urlpatterns = [
    re_path(r'ws/Dashboard/$', DashboardConsumer.as_asgi()),
    re_path(r'ws/consumo/$', ConsumoConsumer.as_asgi()),
]

# Configurando o ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
