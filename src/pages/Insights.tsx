import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Brain, TrendingUp, AlertCircle, Info } from 'lucide-react'

interface Prediction {
  prediction: number
  confidence: string
  score?: number
  historical_data?: Array<{ month: string; amount: number }>
  message?: string
}

interface Insight {
  type: string
  message: string
  category?: string
  amount?: number
  percentage?: number
  day?: string
  average_amount?: number
  change_percentage?: number
  current_amount?: number
  previous_amount?: number
}

export default function Insights() {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrediction()
    fetchInsights()
  }, [])

  const fetchPrediction = async () => {
    try {
      const response = await axios.get('/api/ml/predict-expenses/')
      setPrediction(response.data)
    } catch (error) {
      console.error('Failed to fetch prediction', error)
    }
  }

  const fetchInsights = async () => {
    try {
      const response = await axios.get('/api/ml/insights/')
      setInsights(response.data.insights || [])
    } catch (error) {
      console.error('Failed to fetch insights', error)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800',
    }
    return colors[confidence as keyof typeof colors] || colors.low
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'category_spending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'spending_pattern':
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case 'trend':
        return <Info className="w-5 h-5 text-purple-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading AI insights...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Insights</h1>
      </div>

      {/* Prediction Card */}
      {prediction && (
        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Next Month Expense Prediction</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceBadge(prediction.confidence)}`}>
              {prediction.confidence} confidence
            </span>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold mb-2">
              ${prediction.prediction.toFixed(2)}
            </div>
            {prediction.message && (
              <p className="text-blue-100">{prediction.message}</p>
            )}
          </div>

          {prediction.historical_data && prediction.historical_data.length > 0 && (
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Historical Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={prediction.historical_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={{ fill: '#ffffff', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Insights */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Spending Insights</h2>
        </div>

        <div className="p-6">
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{insight.message}</p>
                    {insight.type === 'category_spending' && insight.amount && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">${insight.amount.toFixed(2)}</span>
                        {' '}spent in {insight.category}
                      </div>
                    )}
                    {insight.type === 'trend' && (
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Current: <span className="font-semibold">${insight.current_amount?.toFixed(2)}</span>
                        </span>
                        <span className="text-gray-600">
                          Previous: <span className="font-semibold">${insight.previous_amount?.toFixed(2)}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Not enough data to generate insights yet.</p>
              <p className="text-sm mt-2">Add more transactions to see personalized insights!</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Financial Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Track your expenses regularly to get more accurate predictions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Set budgets for categories where you spend the most</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Review your spending patterns monthly to identify areas for improvement</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Create savings goals to stay motivated and achieve your financial targets</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
