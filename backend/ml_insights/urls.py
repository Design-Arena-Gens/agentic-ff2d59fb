from django.urls import path
from .views import PredictExpensesView, SpendingInsightsView, PredictCategoryView

urlpatterns = [
    path('predict-expenses/', PredictExpensesView.as_view(), name='predict-expenses'),
    path('insights/', SpendingInsightsView.as_view(), name='insights'),
    path('predict-category/', PredictCategoryView.as_view(), name='predict-category'),
]
