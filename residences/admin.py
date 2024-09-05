from django.contrib import admin
from .models import Residencia, PontoDeUsoDeAgua

@admin.register(Residencia)
class ResidenciaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'endereco', 'usuario')
    search_fields = ('nome', 'endereco')
    list_filter = ('usuario',)
    ordering = ('nome',)

@admin.register(PontoDeUsoDeAgua)
class PontoDeUsoDeAguaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo_ponto', 'residencia')
    search_fields = ('nome', 'tipo_ponto')
    list_filter = ('tipo_ponto', 'residencia')
    ordering = ('nome',)
