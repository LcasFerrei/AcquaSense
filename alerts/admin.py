from django.contrib import admin
from alerts.models import AlertaConsumo, Notificacao

@admin.register(AlertaConsumo)
class AlertaConsumoAdmin(admin.ModelAdmin):
    list_display = ('mensagem', 'data_hora', 'tipo_alerta', 'sensor', 'usuario')
    search_fields = ('mensagem', 'sensor__identificador', 'usuario__username')
    list_filter = ('tipo_alerta', 'sensor', 'usuario')
    ordering = ('-data_hora',)

class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('titulo','mensagem', 'tipo_notificacao', 'usuario', 'data_hora', 'lida')  # Campos a serem exibidos na lista
    list_filter = ('tipo_notificacao', 'lida')  # Filtros para a lista
    search_fields = ('mensagem', 'usuario__username')  # Campos pesquisáveis
    list_editable = ('lida',)  # Permite editar o campo 'lida' diretamente na lista
    ordering = ('-data_hora',)  # Ordenar as notificações pela data, mais recentes primeiro

    # Campos de filtro por data (para facilitar a busca por datas específicas)
    date_hierarchy = 'data_hora'

    # Exibição do campo 'mensagem' de forma mais legível
    def message_truncated(self, obj):
        return obj.mensagem[:50] + '...' if len(obj.mensagem) > 50 else obj.mensagem
    message_truncated.short_description = 'Mensagem'

    # Campos para serem exibidos no formulário de criação/edição
    fieldsets = (
        (None, {
            'fields': ('titulo','mensagem', 'tipo_notificacao', 'usuario', 'lida')
        }),
    )

# Registro do modelo no Django admin
admin.site.register(Notificacao, NotificacaoAdmin)
