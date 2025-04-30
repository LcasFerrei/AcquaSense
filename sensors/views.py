from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta  # Importar timedelta para calcular datas
from .models import RegistroDeConsumo, SensorDeFluxo, PontoDeUsoDeAgua

def specificMonitoring(request):
    # Verifica se a requisição é do tipo GET e contém o parâmetro 'month'
    month = request.GET.get('month')
    
    print(month)

    if not month:
        return JsonResponse({'error': 'Month parameter is required'}, status=400)
    
    try:
        # Converte o parâmetro para um objeto datetime para facilitar o filtro
        month_date = datetime.strptime(month, '%Y-%m')
        start_date = month_date.replace(day=1)
        if month_date.month == 12:
            next_month_date = month_date.replace(year=month_date.year + 1, month=1)
        else:
            next_month_date = month_date.replace(month=month_date.month + 1)

        end_date = next_month_date - timedelta(days=1)

        # Filtra os registros de consumo do mês específico
        registros_consumo = RegistroDeConsumo.objects.filter(
            data_hora__gte=start_date,
            data_hora__lte=end_date
        )

        # Calcula o consumo total do mês
        consumo_total = registros_consumo.aggregate(total=Sum('consumo'))['total'] or 0

        consumo_total = round(consumo_total,2)

        # Calcula o consumo por cada ponto de uso de água
        consumo_por_ponto = {}
        for sensor in SensorDeFluxo.objects.select_related('ponto_uso').all():
            consumo_sensor = registros_consumo.filter(sensor=sensor).aggregate(total=Sum('consumo'))['total'] or 0
            ponto_uso_nome = sensor.ponto_uso.nome
            consumo_por_ponto[ponto_uso_nome] = {
                'consumo': round(consumo_sensor,2),
                'porcentagem': (round(consumo_sensor / consumo_total * 100, 2)) if consumo_total > 0 else 0
            }

        # Retorna os dados como JSON para o frontend
        return JsonResponse({'consumo_total': consumo_total, 'consumo_por_ponto': consumo_por_ponto})
    
    except ValueError:
        return JsonResponse({'error': 'Invalid month format. Use YYYY-MM.'}, status=400)


def consumo_relatorio(request):
    try:
        # Verifica se foi passado um ponto de uso específico
        ponto_uso_id = request.GET.get('ponto_uso_id')
        if ponto_uso_id:
            try:
                ponto_uso = PontoDeUsoDeAgua.objects.get(id=ponto_uso_id)
                filtro_sensor = Q(sensor__ponto_uso=ponto_uso)
            except PontoDeUsoDeAgua.DoesNotExist:
                return JsonResponse({'error': 'Ponto de uso não encontrado'}, status=404)
        else:
            filtro_sensor = Q()

        hoje = timezone.now()
        data_atual = hoje.date()
        
        # 1. Dados acumulados do ano de 2024
        inicio_2024 = timezone.make_aware(datetime(2024, 1, 1))
        fim_2024 = timezone.make_aware(datetime(2024, 12, 31, 23, 59, 59))
        
        consumo_2024 = RegistroDeConsumo.objects.filter(
            filtro_sensor,
            data_hora__range=(inicio_2024, fim_2024)
        ).aggregate(total=Sum('consumo'))['total'] or 0

        # 2. Dados da semana atual (segunda a domingo)
        inicio_semana = hoje - timedelta(days=hoje.weekday())
        inicio_semana = inicio_semana.replace(hour=0, minute=0, second=0)
        fim_semana = inicio_semana + timedelta(days=6, hours=23, minutes=59, seconds=59)
        
        # Consumo por dia da semana para o gráfico
        dias_semana = []
        consumo_diario_semana = []
        for i in range(7):
            dia = inicio_semana + timedelta(days=i)
            dia_fim = dia.replace(hour=23, minute=59, second=59)
            
            consumo_dia = RegistroDeConsumo.objects.filter(
                filtro_sensor,
                data_hora__range=(dia, dia_fim)
            ).aggregate(total=Sum('consumo'))['total'] or 0
            
            dias_semana.append(dia.strftime('%a'))  # Nome abreviado do dia
            consumo_diario_semana.append(float(consumo_dia))

        consumo_semana = sum(consumo_diario_semana)

        # 3. Dados dos últimos 5 dias (com detalhamento diário)
        cinco_dias_atras = (hoje - timedelta(days=5)).replace(hour=0, minute=0, second=0)

        # Criar lista de consumo diário para os últimos 5 dias
        consumo_por_dia = []
        dias_labels = []
        for i in range(5):
            dia_inicio = cinco_dias_atras + timedelta(days=i)
            dia_fim = dia_inicio.replace(hour=23, minute=59, second=59)
            
            consumo_dia = RegistroDeConsumo.objects.filter(
                filtro_sensor,
                data_hora__range=(dia_inicio, dia_fim)
            ).aggregate(total=Sum('consumo'))['total'] or 0
            
            consumo_por_dia.append(float(consumo_dia))
            dias_labels.append(f'Dia {i+1}')

        consumo_5dias = sum(consumo_por_dia)
        porcentagem_5dias = (consumo_5dias / 120) * 100 if 120 != 0 else 0

        # 4. Dados mensais para o gráfico de histórico
        meses = []
        consumo_mensal = []
        for mes in range(1, 13):
            inicio_mes = timezone.make_aware(datetime(2024, mes, 1))
            if mes == 12:
                fim_mes = timezone.make_aware(datetime(2024, 12, 31, 23, 59, 59))
            else:
                fim_mes = timezone.make_aware(datetime(2024, mes+1, 1)) - timedelta(seconds=1)
            
            consumo_mes = RegistroDeConsumo.objects.filter(
                filtro_sensor,
                data_hora__range=(inicio_mes, fim_mes)
            ).aggregate(total=Sum('consumo'))['total'] or 0
            
            meses.append(inicio_mes.strftime('%b'))  # Nome abreviado do mês
            consumo_mensal.append(float(consumo_mes))

        response_data = {
            'ano_2024': {
                'total_litros': float(consumo_2024),
                'periodo': {
                    'inicio': inicio_2024.strftime('%d/%m/%Y'),
                    'fim': fim_2024.strftime('%d/%m/%Y')
                },
                'grafico_mensal': {
                    'meses': meses,
                    'consumo': consumo_mensal
                }
            },
            'semana_atual': {
                'total_litros': float(consumo_semana),
                'periodo': {
                    'inicio': inicio_semana.strftime('%d/%m/%Y'),
                    'fim': fim_semana.strftime('%d/%m/%Y')
                },
                'grafico_diario': {
                    'dias': dias_semana,
                    'consumo': consumo_diario_semana
                }
            },
            'ultimos_5_dias': {
                'total_litros': float(consumo_5dias),
                'porcentagem_consumo': round(porcentagem_5dias, 2),
                'meta_litros': 120,
                'consumo_por_dia': {
                    'labels': dias_labels,
                    'valores': consumo_por_dia
                }
            },
            'status': 'success'
        }

        print(response_data)

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)