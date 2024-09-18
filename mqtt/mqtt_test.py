# import paho.mqtt.client as mqtt

# # Função de callback quando a conexão é estabelecida
# def on_connect(client, userdata, flags, rc):
#     if rc == 0:
#         print("Conectado com sucesso")
#         # Inscrever-se no tópico após a conexão ser estabelecida
#         client.subscribe("teste/acquasense")
#     else:
#         print(f"Falha na conexão com código {rc}")

# # Função de callback quando uma mensagem é recebida
# def on_message(client, userdata, msg):
#     print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")

# # Criar uma instância do cliente
# client = mqtt.Client()

# # Atribuir funções de callback
# client.on_connect = on_connect
# client.on_message = on_message

# # Conectar ao broker MQTT
# broker = "mqtt-dashboard.com"
# port = 1883  # Porta padrão para MQTT
# client.connect(broker, port, 60)

# # Iniciar o loop de rede para o cliente
# client.loop_start()

# # Publicar uma mensagem
# client.publish("teste/acquasense", "Olá do Python!")

# # Manter o script em execução por um tempo para receber mensagens
# import time
# time.sleep(10)  # Ajuste o tempo conforme necessário

# # Desconectar e parar o loop
# client.disconnect()
# client.loop_stop()
