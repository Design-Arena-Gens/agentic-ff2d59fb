import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

interface SavingsGoal {
  id: number
  name: string
  target_amount: string
  current_amount: string
  progress_percentage: number
  target_date: string
  description: string
  is_completed: boolean
}

export default function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [fundAmount, setFundAmount] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    target_date: '',
    description: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/api/transactions/savings-goals/')
      setGoals(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to fetch goals', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/transactions/savings-goals/', formData)
      setShowModal(false)
      setFormData({
        name: '',
        target_amount: '',
        target_date: '',
        description: '',
      })
      fetchGoals()
    } catch (error) {
      console.error('Failed to create goal', error)
    }
  }

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal) return

    try {
      await axios.post(`/api/transactions/savings-goals/${selectedGoal.id}/add_funds/`, {
        amount: fundAmount,
      })
      setShowAddFundsModal(false)
      setSelectedGoal(null)
      setFundAmount('')
      fetchGoals()
    } catch (error) {
      console.error('Failed to add funds', error)
    }
  }

  const openAddFundsModal = (goal: SavingsGoal) => {
    setSelectedGoal(goal)
    setShowAddFundsModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white rounded-lg shadow p-6 ${
              goal.is_completed ? 'border-2 border-green-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{goal.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
              </div>
              {goal.is_completed && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Completed
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold">
                  ${parseFloat(goal.current_amount).toFixed(2)} / ${parseFloat(goal.target_amount).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-sm font-semibold text-primary">
                  {goal.progress_percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Target: {format(new Date(goal.target_date), 'MMM dd, yyyy')}
              </div>
              {!goal.is_completed && (
                <button
                  onClick={() => openAddFundsModal(goal)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Add Funds
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No savings goals yet. Create your first goal!</p>
        </div>
      )}

      {/* Create Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add Savings Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Goal
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

      {/* Add Funds Modal */}
      {showAddFundsModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add Funds to {selectedGoal.name}</h2>
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Amount:</span>
                  <span className="font-semibold">${parseFloat(selectedGoal.current_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Amount:</span>
                  <span className="font-semibold">${parseFloat(selectedGoal.target_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Funds
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFundsModal(false)
                    setSelectedGoal(null)
                    setFundAmount('')
                  }}
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
