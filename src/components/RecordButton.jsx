import React from 'react'
import { Video, Square, AlertCircle } from 'lucide-react'
import { useRecording } from '../contexts/RecordingContext'

const RecordButton = ({ variant = 'primary' }) => {
  const { isRecording, recordingTime, formatTime, startRecording, stopRecording } = useRecording()

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  if (variant === 'danger') {
    return (
      <button
        onClick={handleClick}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isRecording
            ? 'bg-red-600 text-white animate-pulse shadow-lg'
            : 'bg-red-500 text-white hover:bg-red-600 shadow-card'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {isRecording ? (
            <>
              <Square className="w-6 h-6" />
              <span>Stop Recording • {formatTime(recordingTime)}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6" />
              <span>Emergency Record</span>
            </>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording
          ? 'bg-red-500 text-white animate-pulse shadow-lg'
          : 'bg-primary text-white hover:bg-primary/90 shadow-card'
      }`}
    >
      {isRecording ? (
        <Square className="w-8 h-8" />
      ) : (
        <Video className="w-8 h-8" />
      )}
    </button>
  )
}

export default RecordButton