import { useEffect, useState } from 'react'
import api from '../../services/api'

const Timetable = () => {
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      const response = await api.get('/students/timetable')
      setTimetable(response.data)
    } catch (error) {
      console.error('Failed to fetch timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClassesForDay = (dayIndex) => {
    return timetable
      .filter(item => item.day_of_week === dayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Weekly Timetable</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map((day, index) => {
          const classes = getClassesForDay(index)
          return (
            <div key={index} className="card">
              <h2 className="text-xl font-semibold mb-4 text-primary-600">{day}</h2>
              {classes.length === 0 ? (
                <p className="text-gray-600 text-sm">No classes scheduled</p>
              ) : (
                <div className="space-y-3">
                  {classes.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.course_name}</h3>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {item.room}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.course_code}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                      </p>
                      {item.teacher_name && (
                        <p className="text-sm text-gray-600 mt-1">
                          Instructor: {item.teacher_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Timetable
