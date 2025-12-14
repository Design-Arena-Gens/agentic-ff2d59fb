"""
URL configuration for smartfinance project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/ml/', include('ml_insights.urls')),
]
