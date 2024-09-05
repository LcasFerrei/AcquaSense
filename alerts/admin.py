from django.contrib import admin
from alerts.models import AlertaConsumo

@admin.register(AlertaConsumo)
class AlertaConsumoAdmin(admin.ModelAdmin):
    list_display = ('mensagem', 'data_hora', 'tipo_alerta', 'sensor', 'usuario')
    search_fields = ('mensagem', 'sensor__identificador', 'usuario__username')
    list_filter = ('tipo_alerta', 'sensor', 'usuario')
    ordering = ('-data_hora',)
