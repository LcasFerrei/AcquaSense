# urls.py
from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('logout/', user_logout, name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-auth/', check_auth, name='check_auth'),
    path('configuration/', views.config, name='configuration'),
    path('api/username/', get_username, name='get_username'),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/user-profile-edit/', user_profile_edit, name='user-profile'),
]