import paho.mqtt.client as mqtt

class MQTTClient:
    def __init__(self, broker, port, topic):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        print(f"Conectado com código {rc}")
        client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        message = msg.payload.decode()
        print(f"Mensagem recebida no tópico {msg.topic}: {message}")
        self.handle_message(message)

    def handle_message(self, message):
        from sensors.models import RegistroDeConsumo,SensorDeFluxo

        try:
            message = float(message) # YF-S201
            sensor = SensorDeFluxo.objects.filter(identificador="SEN-HZ21WA").first()
            RegistroDeConsumo.objects.create(sensor=sensor,consumo=message)
        except Exception as e:
            print(f"Erro ao inserir no mqtt -> {e}")

    def connect(self):
        self.client.connect(self.broker, self.port, 60)
        self.client.loop_start()

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

    def publish(self, message):
        self.client.publish(self.topic, message)
