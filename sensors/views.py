from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum, Q
from django.utils import timezone
from django.utils.timezone import localtime
from django.utils.timezone import make_aware
from datetime import datetime, timedelta
import pytz
from .models import RegistroDeConsumo, SensorDeFluxo, PontoDeUsoDeAgua
from residences.models import Residencia
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consumo_semanal(request):
    # Obtém a data atual no horário local
    hoje = localtime(timezone.now()).date()

    # Calcula o domingo da semana atual (considerando que domingo é o primeiro dia)
    domingo = hoje - timedelta(days=hoje.weekday() + 1 if hoje.weekday() < 6 else 0)

    # Converte domingo 00:00 no horário local para UTC
    fuso = pytz.timezone('America/Sao_Paulo')
    inicio_semana_local = make_aware(datetime.combine(domingo, datetime.min.time()), timezone=fuso)
    inicio_semana_utc = inicio_semana_local.astimezone(pytz.UTC)

    # Cria um dicionário para armazenar os consumos por dia
    consumos_semana = {
        'Domingo': 0,
        'Segunda': 0,
        'Terca': 0,
        'Quarta': 0,
        'Quinta': 0,
        'Sexta': 0,
        'Sabado': 0,
    }

    # Obtém todas as residências do usuário logado
    residencias = Residencia.objects.filter(usuario__email=request.user.email)

    # Para cada residência, obtém os sensores e seus registros
    for residencia in residencias:
        pontos_uso = PontoDeUsoDeAgua.objects.filter(residencia=residencia)
        for ponto in pontos_uso:
            sensores = SensorDeFluxo.objects.filter(ponto_uso=ponto)
            for sensor in sensores:
                # Filtra registros da semana atual (em UTC)
                registros = RegistroDeConsumo.objects.filter(
                    sensor=sensor,
                    data_hora__gte=inicio_semana_utc
                )

                # Agrupa por dia da semana e soma o consumo
                for registro in registros:
                    # Converte para horário local para saber o dia corretamente
                    data_local = localtime(registro.data_hora)
                    dia_semana = data_local.strftime('%A')

                    # Traduz os dias da semana para português
                    if dia_semana == 'Sunday':
                        consumos_semana['Domingo'] += float(registro.consumo)
                    elif dia_semana == 'Monday':
                        consumos_semana['Segunda'] += float(registro.consumo)
                    elif dia_semana == 'Tuesday':
                        consumos_semana['Terca'] += float(registro.consumo)
                    elif dia_semana == 'Wednesday':
                        consumos_semana['Quarta'] += float(registro.consumo)
                    elif dia_semana == 'Thursday':
                        consumos_semana['Quinta'] += float(registro.consumo)
                    elif dia_semana == 'Friday':
                        consumos_semana['Sexta'] += float(registro.consumo)
                    elif dia_semana == 'Saturday':
                        consumos_semana['Sabado'] += float(registro.consumo)

    # Formata os dados para o gráfico
    dados_grafico = {
        'dias': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        'consumos': [
            consumos_semana['Domingo'],
            consumos_semana['Segunda'],
            consumos_semana['Terca'],
            consumos_semana['Quarta'],
            consumos_semana['Quinta'],
            consumos_semana['Sexta'],
            consumos_semana['Sabado']
        ]
    }

    print(dados_grafico)

    return Response(dados_grafico)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consumo_diario(request):
    # Obtém a data atual (sem hora)
    hoje = localtime(timezone.now()).date()
    
    # Obtém todas as residências do usuário logado
    residencias = Residencia.objects.filter(usuario__email=request.user.email)
    
    consumo_total = 0
    
    # Para cada residência, obtém os sensores e seus registros do dia atual
    for residencia in residencias:
        pontos_uso = PontoDeUsoDeAgua.objects.filter(residencia=residencia)
        for ponto in pontos_uso:
            sensores = SensorDeFluxo.objects.filter(ponto_uso=ponto)
            for sensor in sensores:
                registros = RegistroDeConsumo.objects.filter(
                    sensor=sensor,
                    data_hora__date=hoje
                ).aggregate(total=Sum('consumo'))
                
                if registros['total']:
                    consumo_total += float(registros['total'])
    
    consumo_dash = consumo_total + 10 if consumo_total != 0 else consumo_total

    return Response({
        'data': hoje.strftime('%d/%m/%Y'),
        'consumo_dash':consumo_dash,
        'consumo': consumo_total,
        'meta': 200  # Você pode ajustar isso para ser dinâmico se necessário
    })