from django.http import HttpResponse
from .mqtt_client import MQTTClient
from django.views.decorators.http import require_http_methods   
from django.shortcuts import render,redirect
from .models import MessageTest
import time

def publish_message(request):
    if request.method == 'POST':
        # Obtém a mensagem do formulário
        message = request.POST.get('message', 'Mensagem padrão')

        # Configuração do broker e do tópico
        broker = "mqtt-dashboard.com"
        port = 1883
        topic = "teste/acquasense"

        # Inicializa e publica a mensagem
        mqtt_client = MQTTClient(broker, port, topic)
        mqtt_client.connect()
        mqtt_client.publish(message)
        mqtt_client.disconnect()

        return render(request, 'publish_form.html')

    # Se o método não for POST, renderiza o formulário
    return render(request, 'publish_form.html')

def message_list(request):
    messages = MessageTest.objects.all().order_by('-received_at')
    return render(request, 'message_list.html', {'messages': messages})

