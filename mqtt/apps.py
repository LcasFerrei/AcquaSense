from django.apps import AppConfig

class MqttConfig(AppConfig):
    name = 'mqtt'

    def ready(self):
        from .mqtt_client import MQTTClient
        # Configuração do broker e do tópico
        broker = "mqtt-dashboard.com"
        port = 1883
        topic = "teste/acquasense"
        
        # Inicializa e conecta o cliente MQTT
        self.mqtt_client = MQTTClient(broker, port, topic)
        self.mqtt_client.connect()
