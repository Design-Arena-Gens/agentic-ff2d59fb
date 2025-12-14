from rest_framework import serializers
from .models import Category, Transaction, Budget, SavingsGoal


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'icon', 'color', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'type', 'amount', 'category', 'category_name', 'category_color',
                  'description', 'date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    spent_amount = serializers.SerializerMethodField()
    percentage_used = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'amount', 'spent_amount',
                  'percentage_used', 'period', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_spent_amount(self, obj):
        transactions = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            type='expense',
            date__gte=obj.start_date,
            date__lte=obj.end_date
        )
        total = sum(t.amount for t in transactions)
        return float(total)

    def get_percentage_used(self, obj):
        spent = self.get_spent_amount(obj)
        if obj.amount > 0:
            return round((spent / float(obj.amount)) * 100, 2)
        return 0


class SavingsGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = SavingsGoal
        fields = ['id', 'name', 'target_amount', 'current_amount', 'progress_percentage',
                  'target_date', 'description', 'is_completed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_progress_percentage(self, obj):
        if obj.target_amount > 0:
            return round((float(obj.current_amount) / float(obj.target_amount)) * 100, 2)
        return 0
