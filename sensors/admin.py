from django.contrib import admin
from .models import SensorDeFluxo, RegistroDeConsumo

@admin.register(SensorDeFluxo)
class SensorDeFluxoAdmin(admin.ModelAdmin):
    list_display = ('identificador', 'status', 'ponto_uso')
    search_fields = ('identificador', 'status')
    list_filter = ('status', 'ponto_uso')
    ordering = ('identificador',)

@admin.register(RegistroDeConsumo)
class RegistroDeConsumoAdmin(admin.ModelAdmin):
    list_display = ('sensor', 'data_hora', 'consumo')
    search_fields = ('sensor__identificador',)
    list_filter = ('sensor', 'data_hora')
    ordering = ('-data_hora',)
