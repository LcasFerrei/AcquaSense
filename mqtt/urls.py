from django.urls import path
from . import views

urlpatterns = [
    path('publicar/', views.publish_message, name='publish_message'),
    path('messages/', views.message_list, name='message_list')
]