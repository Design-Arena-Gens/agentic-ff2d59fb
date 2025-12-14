// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Mock data for demo mode (when backend is not available)
export const DEMO_MODE = true

export const DEMO_USER = {
  id: 1,
  username: 'demo',
  email: 'demo@smartfinance.ai',
  monthly_income: '5000',
  currency: 'USD',
  created_at: new Date().toISOString()
}

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Salary', type: 'income', icon: 'briefcase', color: '#10B981', is_default: true },
  { id: 2, name: 'Freelance', type: 'income', icon: 'laptop', color: '#059669', is_default: true },
  { id: 3, name: 'Food & Dining', type: 'expense', icon: 'utensils', color: '#EF4444', is_default: true },
  { id: 4, name: 'Transportation', type: 'expense', icon: 'car', color: '#F59E0B', is_default: true },
  { id: 5, name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#8B5CF6', is_default: true },
  { id: 6, name: 'Entertainment', type: 'expense', icon: 'film', color: '#EC4899', is_default: true },
  { id: 7, name: 'Utilities', type: 'expense', icon: 'zap', color: '#F97316', is_default: true },
]

export const DEMO_TRANSACTIONS = [
  {
    id: 1,
    type: 'income',
    amount: '5000',
    category: 1,
    category_name: 'Salary',
    category_color: '#10B981',
    description: 'Monthly salary',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 2,
    type: 'expense',
    amount: '450',
    category: 3,
    category_name: 'Food & Dining',
    category_color: '#EF4444',
    description: 'Groceries and restaurants',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 3,
    type: 'expense',
    amount: '150',
    category: 4,
    category_name: 'Transportation',
    category_color: '#F59E0B',
    description: 'Gas and uber',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 4,
    type: 'expense',
    amount: '200',
    category: 5,
    category_name: 'Shopping',
    category_color: '#8B5CF6',
    description: 'Clothing',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
]
