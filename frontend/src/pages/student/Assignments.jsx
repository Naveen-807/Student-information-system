import { useEffect, useState } from 'react'
import api from '../../services/api'
import { format } from 'date-fns'
import { Upload, CheckCircle, Clock } from 'lucide-react'

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(null)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/students/assignments')
      setAssignments(response.data)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (assignmentId) => {
    const text = prompt('Enter your submission text:')
    if (!text) return

    setSubmitting(assignmentId)
    try {
      await api.post(`/students/assignments/${assignmentId}/submit`, {
        submissionText: text,
        fileUrl: null
      })
      fetchAssignments()
      alert('Assignment submitted successfully!')
    } catch (error) {
      alert('Failed to submit assignment')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) return <div>Loading...</div>

  const pending = assignments.filter(a => !a.submission_id && new Date(a.due_date) > new Date())
  const submitted = assignments.filter(a => a.submission_id)
  const overdue = assignments.filter(a => !a.submission_id && new Date(a.due_date) <= new Date())

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" size={24} />
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((assignment) => (
              <div key={assignment.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course_name}</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Due {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Marks: {assignment.total_marks}
                  </span>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    disabled={submitting === assignment.id}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Upload size={16} />
                    {submitting === assignment.id ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <p className="text-gray-600">No pending assignments</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            Submitted ({submitted.length})
          </h2>
          <div className="space-y-4">
            {submitted.map((assignment) => (
              <div key={assignment.id} className="card bg-green-50 border-green-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course_name}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Submitted
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-600">
                      Submitted: {format(new Date(assignment.submitted_at), 'MMM dd, yyyy')}
                    </p>
                    {assignment.marks_obtained !== null && (
                      <p className="font-semibold text-green-700 mt-1">
                        Grade: {assignment.marks_obtained}/{assignment.total_marks}
                      </p>
                    )}
                  </div>
                  {assignment.feedback && (
                    <p className="text-gray-700 italic">"{assignment.feedback}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {overdue.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Overdue ({overdue.length})
            </h2>
            <div className="space-y-4">
              {overdue.map((assignment) => (
                <div key={assignment.id} className="card bg-red-50 border-red-200">
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.course_name}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Was due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignments
