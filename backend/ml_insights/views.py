from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from transactions.models import Transaction
from .ml_engine import FinanceMLEngine


class PredictExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('date')

        ml_engine = FinanceMLEngine()
        prediction = ml_engine.predict_next_month_expenses(transactions)

        return Response(prediction)


class SpendingInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('date')

        ml_engine = FinanceMLEngine()
        insights = ml_engine.get_spending_insights(transactions)

        return Response(insights)


class PredictCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount', 0)
        description = request.data.get('description', '')

        ml_engine = FinanceMLEngine()
        prediction = ml_engine.predict_category(amount, description)

        return Response(prediction)
