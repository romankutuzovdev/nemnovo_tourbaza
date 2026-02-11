from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('me/', views.ProfileView.as_view()),
    path('password/change/', views.password_change),
    path('password/reset/', views.password_reset_request),
    path('password/reset/confirm/', views.password_reset_confirm),
]
