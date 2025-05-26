from django.urls import path
from . import views 

urlpatterns = [
    path('SpecificMonitoring/', views.specificMonitoring, name='specificMonitoring'),
    path('relatorio-consumo/', views.consumo_relatorio, name='historico_consumo'),
    path('relatorio-consumo-semanal/', views.consumo_semanal, name='historico_consumo_semanal'),
    path('consumo-diario/', views.consumo_diario, name='consumo-diario'),
    path('consumo-ponto-uso/', views.consumo_ponto_uso, name='consumo-ponto-uso'),
]