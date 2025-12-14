import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
import joblib
import os


class FinanceMLEngine:
    def __init__(self):
        self.expense_predictor = None
        self.category_predictor = None

    def prepare_transaction_data(self, transactions):
        """Convert transactions to DataFrame"""
        data = []
        for trans in transactions:
            data.append({
                'amount': float(trans.amount),
                'type': trans.type,
                'category': trans.category.name if trans.category else 'Uncategorized',
                'date': trans.date,
                'day_of_week': trans.date.weekday(),
                'day_of_month': trans.date.day,
                'month': trans.date.month,
            })
        return pd.DataFrame(data)

    def predict_next_month_expenses(self, transactions):
        """Predict next month's expenses using linear regression"""
        if len(transactions) < 10:
            return {
                'prediction': 0,
                'confidence': 'low',
                'message': 'Insufficient data for prediction'
            }

        df = self.prepare_transaction_data(transactions)
        expense_df = df[df['type'] == 'expense'].copy()

        if len(expense_df) < 5:
            return {
                'prediction': 0,
                'confidence': 'low',
                'message': 'Insufficient expense data'
            }

        # Group by month
        expense_df['year_month'] = expense_df['date'].apply(lambda x: x.strftime('%Y-%m'))
        monthly_expenses = expense_df.groupby('year_month')['amount'].sum().reset_index()
        monthly_expenses['month_index'] = range(len(monthly_expenses))

        if len(monthly_expenses) < 3:
            avg_expense = monthly_expenses['amount'].mean()
            return {
                'prediction': float(avg_expense),
                'confidence': 'medium',
                'message': 'Prediction based on historical average'
            }

        # Train model
        X = monthly_expenses[['month_index']].values
        y = monthly_expenses['amount'].values

        model = LinearRegression()
        model.fit(X, y)

        # Predict next month
        next_month_index = len(monthly_expenses)
        prediction = model.predict([[next_month_index]])[0]

        # Calculate confidence based on R² score
        score = model.score(X, y)
        confidence = 'high' if score > 0.7 else 'medium' if score > 0.4 else 'low'

        return {
            'prediction': float(max(0, prediction)),
            'confidence': confidence,
            'score': float(score),
            'historical_data': [
                {'month': row['year_month'], 'amount': float(row['amount'])}
                for _, row in monthly_expenses.iterrows()
            ]
        }

    def get_spending_insights(self, transactions):
        """Generate insights from transaction data"""
        if not transactions:
            return {
                'insights': [],
                'message': 'No transactions available for analysis'
            }

        df = self.prepare_transaction_data(transactions)
        insights = []

        # Top spending categories
        expense_df = df[df['type'] == 'expense']
        if len(expense_df) > 0:
            top_categories = expense_df.groupby('category')['amount'].sum().sort_values(ascending=False).head(3)
            total_expenses = expense_df['amount'].sum()

            for category, amount in top_categories.items():
                percentage = (amount / total_expenses) * 100
                insights.append({
                    'type': 'category_spending',
                    'category': category,
                    'amount': float(amount),
                    'percentage': float(percentage),
                    'message': f"{category} accounts for {percentage:.1f}% of your total expenses"
                })

        # Day of week analysis
        if len(expense_df) > 7:
            daily_avg = expense_df.groupby('day_of_week')['amount'].mean()
            max_day = daily_avg.idxmax()
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

            insights.append({
                'type': 'spending_pattern',
                'message': f"You tend to spend more on {days[max_day]}s",
                'day': days[max_day],
                'average_amount': float(daily_avg[max_day])
            })

        # Trend analysis
        if len(df) > 30:
            recent_30 = df[df['date'] >= (datetime.now().date() - timedelta(days=30))]
            previous_30 = df[(df['date'] >= (datetime.now().date() - timedelta(days=60))) &
                           (df['date'] < (datetime.now().date() - timedelta(days=30)))]

            recent_expense = recent_30[recent_30['type'] == 'expense']['amount'].sum()
            previous_expense = previous_30[previous_30['type'] == 'expense']['amount'].sum()

            if previous_expense > 0:
                change = ((recent_expense - previous_expense) / previous_expense) * 100
                trend = 'increased' if change > 0 else 'decreased'

                insights.append({
                    'type': 'trend',
                    'message': f"Your spending has {trend} by {abs(change):.1f}% compared to last month",
                    'change_percentage': float(change),
                    'current_amount': float(recent_expense),
                    'previous_amount': float(previous_expense)
                })

        return {
            'insights': insights,
            'total_analyzed': len(df)
        }

    def predict_category(self, amount, description):
        """Predict transaction category based on amount and description"""
        # Simple rule-based prediction (can be enhanced with ML)
        categories = {
            'food': ['food', 'restaurant', 'grocery', 'lunch', 'dinner', 'breakfast'],
            'transport': ['uber', 'taxi', 'gas', 'fuel', 'transport', 'parking'],
            'entertainment': ['movie', 'game', 'netflix', 'spotify', 'entertainment'],
            'shopping': ['amazon', 'shop', 'store', 'mall', 'clothing'],
            'utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
            'health': ['doctor', 'hospital', 'pharmacy', 'medical', 'health'],
        }

        description_lower = description.lower()

        for category, keywords in categories.items():
            if any(keyword in description_lower for keyword in keywords):
                return {
                    'predicted_category': category,
                    'confidence': 0.8
                }

        return {
            'predicted_category': 'other',
            'confidence': 0.3
        }
