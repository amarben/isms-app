import React from 'react'
import { Check, Cloud, AlertCircle, Loader } from 'lucide-react'

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date | null
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status, lastSaved }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader className="w-4 h-4 animate-spin" />,
          text: 'Saving...',
          className: 'text-blue-600 bg-blue-50 border-blue-200'
        }
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: 'Saved',
          className: 'text-green-600 bg-green-50 border-green-200'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Save failed',
          className: 'text-red-600 bg-red-50 border-red-200'
        }
      default:
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: lastSaved ? `Last saved ${getRelativeTime(lastSaved)}` : 'Auto-save enabled',
          className: 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }
  }

  const getRelativeTime = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  const display = getStatusDisplay()

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${display.className}`}>
      {display.icon}
      <span>{display.text}</span>
    </div>
  )
}

export default SaveIndicator
