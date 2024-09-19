import paho.mqtt.client as mqtt

class MQTTClient:
    def __init__(self, broker, port, topic):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect

    def on_connect(self, client, userdata, flags, rc):
        print(f"Conectado com código {rc} ao broker {self.broker}")

    def on_message(self, client, userdata, msg):
        message = msg.payload.decode()
        print(f"Mensagem recebida no tópico {msg.topic}: {message}")
        self.handle_message(message)

    def on_disconnect(self, client, userdata, rc):
        print(f"Desconectado com código {rc} do broker {self.broker}")

    def connect(self):
        self.client.connect(self.broker, self.port, 60)
        self.client.loop_start()
    
    def publish(self, message):
        self.client.publish(self.topic, message)

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
