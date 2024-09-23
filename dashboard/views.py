from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def dashboard(request):
    data = {
        "news": "Após a criação do AcquaSense, tivemos uma redução em média de 20% no consumo de água nas condomínios que faturamos.",
        "daily_consumption": "150 Litros",
        "pipes_status": "Normal",
        "daily_goal": "120 Litros",
        "accumulated_consumption": "540 Litros"
    }
    return Response(data)
