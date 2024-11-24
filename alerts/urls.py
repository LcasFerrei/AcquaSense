from django.urls import path
from . import views

urlpatterns = [
    path('notificacoes/', views.notificacoes, name='notificacoes'),
    path('notificacao/marcar_como_lida/<int:notificacao_id>/', views.marcar_como_lida, name='marcar_como_lida'),
    path('notificacao/unread-notifications/', views.get_unread_notifications, name='unread_notifications'),
    path('notificacao/nao_lidas_notificacoes/', views.nao_lidas_notificacoes, name='unread_notifications'),
]
