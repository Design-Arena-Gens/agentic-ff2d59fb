from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from datetime import datetime, timedelta
from .models import Category, Transaction, Budget, SavingsGoal
from .serializers import (
    CategorySerializer, TransactionSerializer,
    BudgetSerializer, SavingsGoalSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(
            Q(user=self.request.user) | Q(is_default=True)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)

        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(date__gte=start_date, date__lte=end_date)

        # Filter by type
        trans_type = self.request.query_params.get('type')
        if trans_type:
            queryset = queryset.filter(type=trans_type)

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=30)

        transactions = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        expenses = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0

        # Category breakdown
        category_breakdown = []
        for category in Category.objects.filter(user=request.user):
            amount = transactions.filter(category=category).aggregate(Sum('amount'))['amount__sum'] or 0
            if amount > 0:
                category_breakdown.append({
                    'category': category.name,
                    'amount': float(amount),
                    'color': category.color,
                    'type': category.type
                })

        return Response({
            'total_income': float(income),
            'total_expenses': float(expenses),
            'balance': float(income - expenses),
            'category_breakdown': category_breakdown,
            'start_date': start_date,
            'end_date': end_date
        })


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_funds(self, request, pk=None):
        goal = self.get_object()
        amount = request.data.get('amount', 0)

        try:
            amount = float(amount)
            goal.current_amount += amount
            if goal.current_amount >= goal.target_amount:
                goal.is_completed = True
            goal.save()

            return Response(SavingsGoalSerializer(goal).data)
        except ValueError:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
