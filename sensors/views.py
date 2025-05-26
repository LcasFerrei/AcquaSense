from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum, Q, F, ExpressionWrapper, FloatField
from django.utils import timezone
from django.utils.timezone import localtime
from django.utils.timezone import make_aware
from datetime import datetime, timedelta
import pytz
from .models import RegistroDeConsumo, SensorDeFluxo, PontoDeUsoDeAgua, RegistroDeConsumoSerializer
from residences.models import Residencia
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

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

        # 2. Dados de 2025 (do início do ano até o mês atual)
        inicio_2025 = timezone.make_aware(datetime(2025, 1, 1))
        fim_2025 = hoje  # Até a data/hora atual
        
        # Consumo por mês em 2025 para o gráfico
        meses_2025 = []
        consumo_mensal_2025 = []
        for mes in range(1, hoje.month + 1):
            inicio_mes = timezone.make_aware(datetime(2025, mes, 1))
            if mes == hoje.month:
                fim_mes = hoje
            else:
                fim_mes = timezone.make_aware(datetime(2025, mes+1, 1)) - timedelta(seconds=1)
            
            consumo_mes = RegistroDeConsumo.objects.filter(
                filtro_sensor,
                data_hora__range=(inicio_mes, fim_mes)
            ).aggregate(total=Sum('consumo'))['total'] or 0
            
            meses_2025.append(inicio_mes.strftime('%b'))  # Nome abreviado do mês
            consumo_mensal_2025.append(float(consumo_mes))

        consumo_total_2025 = sum(consumo_mensal_2025)

        # 3. Dados da semana atual (segunda a domingo)
        inicio_semana = hoje - timedelta(days=hoje.weekday())
        inicio_semana = inicio_semana.replace(hour=0, minute=0, second=0)
        fim_semana = inicio_semana + timedelta(days=6, hours=23, minutes=59, seconds=59)
        
        # Consumo por dia da semana para o gráfico
        dias_semana = []
        consumo_diario_semana = []
        datas_semana = []
        
        for i in range(7):
            dia = inicio_semana + timedelta(days=i)
            dia_fim = dia.replace(hour=23, minute=59, second=59)
            
            consumo_dia = RegistroDeConsumo.objects.filter(
                filtro_sensor,
                data_hora__range=(dia, dia_fim)
            ).aggregate(total=Sum('consumo'))['total'] or 0
            
            dias_semana.append(dia.strftime('%a'))  # Nome abreviado do dia
            datas_semana.append(dia.date().strftime('%d/%m/%Y'))
            consumo_diario_semana.append(float(consumo_dia))

        consumo_semana = sum(consumo_diario_semana)
        
        # Calcular porcentagem da semana atual (considerando meta de 350L)
        porcentagem_semana = (consumo_semana / 350) * 100 if 350 != 0 else 0

        response_data = {
            'ano_2024': {
                'total_litros': float(consumo_2024),
                'periodo': {
                    'inicio': inicio_2024.strftime('%d/%m/%Y'),
                    'fim': fim_2024.strftime('%d/%m/%Y')
                }
            },
            'ano_2025': {
                'total_litros': float(consumo_total_2025),
                'periodo': {
                    'inicio': inicio_2025.strftime('%d/%m/%Y'),
                    'fim': fim_2025.strftime('%d/%m/%Y')
                },
                'grafico_mensal': {
                    'meses': meses_2025,
                    'consumo': consumo_mensal_2025
                }
            },
            'semana_atual': {
                'total_litros': float(consumo_semana),
                'porcentagem_consumo': round(porcentagem_semana, 2),
                'periodo': {
                    'inicio': inicio_semana.strftime('%d/%m/%Y'),
                    'fim': fim_semana.strftime('%d/%m/%Y')
                },
                'grafico_diario': {
                    'dias': dias_semana,
                    'datas': datas_semana,
                    'consumo': consumo_diario_semana
                }
            },
            'status': 'success'
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consumo_semanal(request):
    # Obtém a data atual no horário locall
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
    meta = 200
    porcentagem = (consumo_total / meta) * 100 if meta > 0 else 0

    return Response({
        'data': hoje.strftime('%d/%m/%Y'),
        'consumo_dash':consumo_dash,
        'consumo': consumo_total,
        'meta': meta,  # Você pode ajustar isso para ser dinâmico se necessário
        'porcentagem': round(porcentagem, 1)  # Arredonda para 1 casa decimal
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consumo_ponto_uso(request):
    # Obter parâmetros da requisição
    periodo = request.query_params.get('periodo', '1mes')
    residencia_id = request.query_params.get('residencia_id')
    
    # Verificar permissão
    try:
        residencia = Residencia.objects.filter(id=residencia_id).first()
        if not residencia:
            return Response(
                {'error': 'Acesso não autorizado'},
                status=status.HTTP_403_FORBIDDEN
            )
    except:
        return Response(
            {'error': 'ID inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calcular datas
    hoje = timezone.now()
    periodos = {
        '1semana': 7,
        '1mes': 30,
        '3meses': 90,
        '6meses': 180,
        '1ano': 365
    }
    dias = periodos.get(periodo, 30)
    data_inicio = hoje - timedelta(days=dias)

    # Obter pontos de uso
    pontos_uso = PontoDeUsoDeAgua.objects.filter(residencia_id=residencia_id)
    
    # Gerar labels para o gráfico
    labels = gerar_labels_periodo(periodo)
    
    resultado = {
        'periodo': periodo,
        'labels': labels,
        'data_inicio': data_inicio,
        'data_fim': hoje,
        'pontos': []
    }

    print("DATA_INICIO", data_inicio)
    for ponto in pontos_uso:
        ponto_data = {
            'ponto_id': ponto.id,
            'nome': ponto.nome,
            'tipo': ponto.tipo_ponto,
            'comodo': ponto.comodos,
            'sensores': [],
            'registros': []
        }

        for sensor in ponto.sensores_fluxo.all():
            # Obter registros brutos
            registros = sensor.registros_consumo.filter(
                data_hora__range=(data_inicio, hoje)
            ).order_by('data_hora')
            
            # Agregar por período
            print(data_inicio)
            print(hoje)
            print(registros)
            dados_grafico = agregar_consumo_por_periodo(registros, periodo, data_inicio, hoje)
            
            # Calcular totais
            consumo_total = registros.aggregate(total=Sum('consumo'))['total'] or 0.0
            horas_total = (hoje - data_inicio).total_seconds() / 3600
            vazao_media = float(consumo_total) / horas_total if horas_total > 0 else 0.0
            
            sensor_data = {
                'sensor_id': sensor.id,
                'identificador': sensor.identificador,
                'consumo_total': float(consumo_total),
                'vazao_media': round(vazao_media, 2),
                'status': sensor.status,
                'dados_grafico': dados_grafico,
                'registros': RegistroDeConsumoSerializer(registros, many=True).data
            }
            
            ponto_data['sensores'].append(sensor_data)
            ponto_data['registros'].extend(sensor_data['registros'])
        
        resultado['pontos'].append(ponto_data)

    return Response(resultado, status=status.HTTP_200_OK)


# Funções auxiliares
def gerar_labels_periodo(periodo):
    if periodo == '1semana':
        return [f'Dia {i}' for i in range(1, 8)]
    elif periodo == '1mes':
        return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
    elif periodo == '3meses':
        return ['Mês 1', 'Mês 2', 'Mês 3']
    elif periodo == '6meses':
        return [f'Mês {i}' for i in range(1, 7)]
    elif periodo == '1ano':
        return [f'{mes}/2025' for mes in ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']]
    return ['Período 1', 'Período 2', 'Período 3', 'Período 4']

def agregar_consumo_por_periodo(registros, periodo, data_inicio, data_fim):
    if periodo == '1semana':
        return agregar_por_dia(registros, data_inicio, 7)
    elif periodo == '1mes':
        semanas = 4  # 4 semanas em um mês
        return agregar_por_semana(registros, data_inicio, data_fim, semanas)
    elif periodo in ['3meses', '6meses', '1ano']:
        return agregar_por_mes(registros, data_inicio, data_fim)
    return []

def agregar_por_dia(registros, data_inicio, num_dias):
    dados = [0.0] * num_dias
    for registro in registros:
        delta = (registro.data_hora - data_inicio).days
        if 0 <= delta < num_dias:
            dados[delta] += float(registro.consumo)
    return dados

def agregar_por_semana(registros, data_inicio, data_fim, num_semanas):
    dados = [0.0] * num_semanas
    dias_por_semana = 7
    total_dias = (data_fim - data_inicio).days
    
    for registro in registros:
        delta_dias = (registro.data_hora - data_inicio).days
        if 0 <= delta_dias <= total_dias:
            semana = delta_dias // dias_por_semana
            if semana < num_semanas:
                dados[semana] += float(registro.consumo)
    return dados

def agregar_por_mes(registros, data_inicio, data_fim):
    # Calcula o número de meses entre as datas
    num_meses = (data_fim.year - data_inicio.year) * 12 + (data_fim.month - data_inicio.month) + 1
    dados = [0.0] * num_meses
    
    for registro in registros:
        if data_inicio <= registro.data_hora <= data_fim:
            delta_meses = (registro.data_hora.year - data_inicio.year) * 12 + (registro.data_hora.month - data_inicio.month)
            if 0 <= delta_meses < num_meses:
                dados[delta_meses] += float(registro.consumo)
    return dados