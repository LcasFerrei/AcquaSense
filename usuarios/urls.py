from django.urls import path
from . import views

urlpatterns = [
    path('authentication/',views.authentication,name='authentication'),
    path('cadastrar/',views.cadastrar,name='cadastrar'),
    path('logout/',views.logout,name='logout')
]