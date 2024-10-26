from django.urls import path
from .views import specificMonitoring

urlpatterns = [
    path('SpecificMonitoring/', specificMonitoring, name='specificMonitoring'),
]
