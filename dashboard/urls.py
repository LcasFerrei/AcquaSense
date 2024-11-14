from django.urls import path
from . import views

urlpatterns = [
    path('Dashboard/', views.dashboard, name='dashboard'),
]