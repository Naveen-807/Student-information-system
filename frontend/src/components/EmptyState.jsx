import { FileQuestion } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = FileQuestion, 
  title = 'No data found', 
  description = 'There is no data to display at the moment.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-4">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
