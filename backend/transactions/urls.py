from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, BudgetViewSet, SavingsGoalViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'savings-goals', SavingsGoalViewSet, basename='savings-goal')

urlpatterns = [
    path('', include(router.urls)),
]
