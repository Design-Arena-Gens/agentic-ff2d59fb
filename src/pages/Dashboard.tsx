import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

interface Summary {
  total_income: number
  total_expenses: number
  balance: number
  category_breakdown: Array<{
    category: string
    amount: number
    color: string
    type: string
  }>
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const response = await axios.get('/api/transactions/summary/', {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
      })
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch summary', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const expenseData = summary?.category_breakdown.filter(item => item.type === 'expense') || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success mt-1">
                ${summary?.total_income.toFixed(2) || '0.00'}
              </p>
            </div>
            <ArrowUpCircle className="w-12 h-12 text-success opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-danger mt-1">
                ${summary?.total_expenses.toFixed(2) || '0.00'}
              </p>
            </div>
            <ArrowDownCircle className="w-12 h-12 text-danger opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${
                (summary?.balance || 0) >= 0 ? 'text-success' : 'text-danger'
              }`}>
                ${summary?.balance.toFixed(2) || '0.00'}
              </p>
            </div>
            <DollarSign className={`w-12 h-12 opacity-20 ${
              (summary?.balance || 0) >= 0 ? 'text-success' : 'text-danger'
            }`} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.category}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-12">No expense data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Category Comparison</h2>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-12">No data available</div>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Top Categories</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {expenseData.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.category}</span>
                </div>
                <span className="font-semibold">${category.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
