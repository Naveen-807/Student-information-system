import { useEffect, useState } from 'react'
import api from '../../services/api'
import { format } from 'date-fns'
import { DollarSign } from 'lucide-react'

const Fees = () => {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFees()
  }, [])

  const fetchFees = async () => {
    try {
      const response = await api.get('/students/fees')
      setFees(response.data)
    } catch (error) {
      console.error('Failed to fetch fees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return <div>Loading...</div>

  const totalPending = fees.reduce((sum, fee) => sum + (fee.amount - fee.paid_amount), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fee Management</h1>

      <div className="card mb-6 bg-primary-50 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="bg-primary-600 p-4 rounded-lg">
            <DollarSign size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Pending Amount</p>
            <p className="text-3xl font-bold text-primary-600">
              ${totalPending.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {fees.map((fee) => (
          <div key={fee.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  Semester {fee.semester} - {fee.year}
                </h3>
                <p className="text-sm text-gray-600">
                  Due Date: {format(new Date(fee.due_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(fee.status)}`}>
                {fee.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-semibold">${fee.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-lg font-semibold text-green-600">
                  ${fee.paid_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-red-600">
                  ${(fee.amount - fee.paid_amount).toFixed(2)}
                </p>
              </div>
            </div>

            {fee.payments && fee.payments.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Payment History</p>
                <div className="space-y-2">
                  {fee.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                      </span>
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fee.status !== 'paid' && (
              <button className="w-full btn btn-primary mt-4">
                Pay Now
              </button>
            )}
          </div>
        ))}
        {fees.length === 0 && (
          <p className="text-center py-8 text-gray-600">No fee records found</p>
        )}
      </div>
    </div>
  )
}

export default Fees
