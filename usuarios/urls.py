# urls.py
from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='csrf_token'),
    path('clear-csrf/', views.clear_csrf, name='clear_csrf'),
    path('logout/', logout_view, name='logout'),
    path('register/', views.register_user, name='register'),
    path('login/', login_view, name='login'),
    path('check-auth/', check_auth_view, name='check_auth'),
    path('configuration/', views.config, name='configuration'),
    path('api/username/', get_username, name='get_username'),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/user-profile-edit/', UserProfileViewEdit.as_view(), name='user-profile'),
]
