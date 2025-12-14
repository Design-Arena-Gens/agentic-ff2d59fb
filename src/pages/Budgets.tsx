import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'

interface Budget {
  id: number
  category: number
  category_name: string
  amount: string
  spent_amount: number
  percentage_used: number
  period: string
  start_date: string
  end_date: string
}

interface Category {
  id: number
  name: string
  type: string
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  })

  useEffect(() => {
    fetchBudgets()
    fetchCategories()
  }, [])

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/transactions/budgets/')
      setBudgets(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to fetch budgets', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/transactions/categories/')
      const allCategories = response.data.results || response.data
      setCategories(allCategories.filter((cat: Category) => cat.type === 'expense'))
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endDate = new Date(formData.start_date)
      endDate.setMonth(endDate.getMonth() + 1)

      await axios.post('/api/transactions/budgets/', {
        ...formData,
        end_date: endDate.toISOString().split('T')[0],
      })

      setShowModal(false)
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
      })
      fetchBudgets()
    } catch (error) {
      console.error('Failed to create budget', error)
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{budget.category_name}</h3>
                <p className="text-sm text-gray-500">{budget.period}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                budget.percentage_used >= 100
                  ? 'bg-red-100 text-red-800'
                  : budget.percentage_used >= 80
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {budget.percentage_used.toFixed(0)}%
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-semibold">
                  ${budget.spent_amount.toFixed(2)} / ${parseFloat(budget.amount).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(budget.percentage_used)}`}
                  style={{ width: `${Math.min(budget.percentage_used, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No budgets yet. Create your first budget!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
