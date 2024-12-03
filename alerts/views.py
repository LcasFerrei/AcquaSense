from django.shortcuts import render
from django.http import JsonResponse
from .models import Notificacao
from django.contrib.auth.decorators import login_required
from usuarios.models import CustomUser
from datetime import timedelta

@login_required
def notificacoes(request):
    user = CustomUser.objects.filter(email=request.user.email).first()
    notificacoes = Notificacao.objects.filter(usuario=user).order_by('-data_hora')

    # Transformando as notificações em um formato de dicionário para enviar ao frontend
    notificacoes_data = [
        {
            'id': notificacao.id,
            'title': notificacao.titulo,  # Pega os primeiros 30 caracteres da mensagem
            'time': (notificacao.data_hora - timedelta(hours=3)).strftime('%H:%M'),
            'details': notificacao.mensagem,
            'unread': not notificacao.lida
        }
        for notificacao in notificacoes
    ]

    return JsonResponse({'notificacoes': notificacoes_data})

@login_required
def nao_lidas_notificacoes(request):
    user = CustomUser.objects.filter(email=request.user.email).first()
    unread_count = Notificacao.objects.filter(usuario=user, lida=False)

    # Transformando as notificações em um formato de dicionário para enviar ao frontend
    notificacoes_data = [
        {
            'id': notificacao.id,
            'title': notificacao.titulo,  # Pega os primeiros 30 caracteres da mensagem
            'time': (notificacao.data_hora - timedelta(hours=3)).strftime('%H:%M'),
            'details': notificacao.mensagem,
            'unread': not notificacao.lida
        }
        for notificacao in unread_count
    ]

    print(notificacoes_data)

    return JsonResponse({'notificacoes': notificacoes_data})

@login_required
def get_unread_notifications(request):
    user = CustomUser.objects.filter(email=request.user.email).first()
    unread_count = Notificacao.objects.filter(usuario=user, lida=False).count()
    return JsonResponse({"unread_count": unread_count})

@login_required
def marcar_como_lida(request, notificacao_id):
    try:
        user = CustomUser.objects.filter(email=request.user.email).first()
        notificacao = Notificacao.objects.get(id=notificacao_id, usuario=user)
        notificacao.lida = True
        notificacao.save()
        return JsonResponse({'status': 'success', 'message': 'Notificação marcada como lida.'})
    except Notificacao.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Notificação não encontrada.'}, status=404)