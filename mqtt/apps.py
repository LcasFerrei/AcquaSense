from django.apps import AppConfig
from threading import Thread
from .mqtt_client import MQTTClient
from django.db.models.signals import post_migrate
from django.core.cache import cache

class MqttConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mqtt'

    def ready(self):
        # Evita conexão duplicada em workers
        if not cache.get('mqtt_connected'):
            cache.set('mqtt_connected', True, None)

            # Configuração do broker e do tópico
            broker = "mqtt-dashboard.com"
            port = 1883
            topic = "teste/acquasense"

            # Inicializa o cliente MQTT
            mqtt_client = MQTTClient(broker, port, topic)
            
            # Conecta de forma assíncrona
            mqtt_client.connect()