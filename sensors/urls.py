from django.urls import path
from . import views 

urlpatterns = [
    path('SpecificMonitoring/', views.specificMonitoring, name='specificMonitoring'),
    path('relatorio-consumo/', views.consumo_relatorio, name='historico_consumo'),
]
