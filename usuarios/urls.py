# urls.py
from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-auth/', check_auth, name='check_auth'),
    path('configuration/', views.config, name='configuration'),
]