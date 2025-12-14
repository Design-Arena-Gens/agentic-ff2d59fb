# SmartFinance AI - Personal Finance & Expense Tracker

A full-stack, production-ready web application for personal finance management with AI-powered insights and predictions using Machine Learning.

## 🎯 Features

- **User Authentication**: Secure JWT-based authentication system
- **Transaction Management**: Track income and expenses with categories
- **Budget Tracking**: Set and monitor budgets for different categories
- **Savings Goals**: Create and track progress towards savings goals
- **AI-Powered Insights**: Machine learning-based spending analysis and predictions
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework
- JWT Authentication (SimpleJWT)
- SQLite (development) / PostgreSQL (production)
- scikit-learn, pandas, numpy for ML

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts for visualizations
- Axios for API calls

## 📦 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create default categories
python seed_data.py

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🚀 Usage

1. Register a new account or login
2. Add transactions (income/expenses)
3. Set budgets for different categories
4. Create savings goals
5. View AI-powered insights and predictions

## 🧠 Machine Learning Features

### Expense Prediction
- Uses Linear Regression to predict next month's expenses
- Analyzes historical spending patterns
- Provides confidence levels (high/medium/low)

### Spending Insights
- Category-wise spending analysis
- Day-of-week spending patterns
- Month-over-month trend analysis
- Automated insights generation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/profile/` - Get user profile

### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/summary/` - Get financial summary
- `DELETE /api/transactions/{id}/` - Delete transaction

### Budgets
- `GET /api/transactions/budgets/` - List budgets
- `POST /api/transactions/budgets/` - Create budget

### Savings Goals
- `GET /api/transactions/savings-goals/` - List goals
- `POST /api/transactions/savings-goals/` - Create goal
- `POST /api/transactions/savings-goals/{id}/add_funds/` - Add funds to goal

### ML Insights
- `GET /api/ml/predict-expenses/` - Get expense predictions
- `GET /api/ml/insights/` - Get spending insights

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with Django's built-in system
- CORS configuration for API security
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI Components

- Interactive Dashboard with charts
- Transaction management interface
- Budget tracking cards with progress bars
- Savings goals with progress indicators
- AI insights dashboard

## 📝 Project Structure

```
smartfinance-ai/
├── backend/
│   ├── accounts/          # User authentication
│   ├── transactions/      # Transaction, Budget, Category models
│   ├── ml_insights/       # ML prediction engine
│   └── smartfinance/      # Django project settings
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context (Auth)
│   └── main.tsx          # Entry point
├── requirements.txt      # Python dependencies
├── package.json         # Node dependencies
└── README.md           # Documentation
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy --prod
```

### Backend
This demo uses a mock API. For production, deploy Django backend separately using:
- Heroku
- Railway
- PythonAnywhere
- AWS/Google Cloud

## 📚 Future Enhancements

- Recurring transactions
- Export data to CSV/PDF
- Email notifications
- Mobile app (React Native)
- Advanced ML models (LSTM for time series)
- Multi-currency support
- Receipt scanning with OCR

## 👨‍💻 Author

Final Year BSc IT Project - SmartFinance AI

## 📄 License

This project is licensed for educational purposes.
