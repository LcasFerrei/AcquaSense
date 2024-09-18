from django.contrib import admin
from mqtt.models import MessageTest

@admin.register(MessageTest)
class MqttAdmin(admin.ModelAdmin):
    list_display = ('content', 'received_at')
    ordering = ('-received_at',)
    search_fields = ('content',)