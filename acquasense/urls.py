from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('alerts/',include('alerts.urls')),
    path('',include('usuarios.urls')),
    path('',include('dashboard.urls')),
    path('mqtt/', include('mqtt.urls')),
    path('',include('sensors.urls'))
]

