from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum  # Importar Sum do django.db.models
from datetime import datetime, timedelta  # Importar timedelta para calcular datas
from .models import RegistroDeConsumo, SensorDeFluxo, PontoDeUsoDeAgua

def specificMonitoring(request):
    # Verifica se a requisição é do tipo GET e contém o parâmetro 'month'
    month = request.GET.get('month')
    
    if not month:
        return JsonResponse({'error': 'Month parameter is required'}, status=400)
    
    try:
        # Converte o parâmetro para um objeto datetime para facilitar o filtro
        month_date = datetime.strptime(month, '%Y-%m')
        start_date = month_date.replace(day=1)
        end_date = (month_date.replace(month=month_date.month % 12 + 1, day=1) - timedelta(days=1))

        # Filtra os registros de consumo do mês específico
        registros_consumo = RegistroDeConsumo.objects.filter(
            data_hora__gte=start_date,
            data_hora__lte=end_date
        )

        # Calcula o consumo total do mês
        consumo_total = registros_consumo.aggregate(total=Sum('consumo'))['total'] or 0

        # Calcula o consumo por cada ponto de uso de água
        consumo_por_ponto = {}
        for sensor in SensorDeFluxo.objects.select_related('ponto_uso').all():
            consumo_sensor = registros_consumo.filter(sensor=sensor).aggregate(total=Sum('consumo'))['total'] or 0
            ponto_uso_nome = sensor.ponto_uso.nome
            consumo_por_ponto[ponto_uso_nome] = {
                'consumo': consumo_sensor,
                'porcentagem': (consumo_sensor / consumo_total * 100) if consumo_total > 0 else 0
            }

        # Retorna os dados como JSON para o frontend
        return JsonResponse({'consumo_total': consumo_total, 'consumo_por_ponto': consumo_por_ponto})
    
    except ValueError:
        return JsonResponse({'error': 'Invalid month format. Use YYYY-MM.'}, status=400)
