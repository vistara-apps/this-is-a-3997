import React, { useState } from 'react'
import { Video, Square, AlertCircle, Loader, Cloud, CloudOff } from 'lucide-react'
import { useRecording } from '../contexts/RecordingContext'
import { useUser } from '../contexts/UserContext'
import { storageService } from '../services/supabase'

const RecordButton = ({ variant = 'primary' }) => {
  const { isRecording, recordingTime, formatTime, startRecording, stopRecording, error } = useRecording()
  const { user, isPremium } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleClick = async () => {
    try {
      if (isRecording) {
        const recordingData = await stopRecording()
        
        // If user is premium and has cloud storage enabled, upload to Supabase
        if (isPremium && recordingData && user) {
          setIsUploading(true)
          setUploadProgress(0)
          
          try {
            const { url, error: uploadError } = await storageService.uploadRecording(
              recordingData.blob,
              user.id,
              recordingData.id
            )
            
            if (uploadError) {
              console.error('Upload failed:', uploadError)
              // Still save locally even if cloud upload fails
            } else {
              console.log('Recording uploaded successfully:', url)
            }
          } catch (uploadError) {
            console.error('Upload error:', uploadError)
          } finally {
            setIsUploading(false)
            setUploadProgress(0)
          }
        }
      } else {
        await startRecording()
      }
    } catch (error) {
      console.error('Recording error:', error)
    }
  }

  const isDisabled = isUploading

  if (variant === 'danger') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse shadow-lg'
              : 'bg-red-500 text-white hover:bg-red-600 shadow-card'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-center space-x-3">
            {isUploading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                <span>Uploading... {Math.round(uploadProgress)}%</span>
              </>
            ) : isRecording ? (
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
        
        {/* Cloud storage indicator */}
        <div className="absolute top-2 right-2">
          {isPremium ? (
            <Cloud className="w-4 h-4 text-white/70" title="Cloud storage enabled" />
          ) : (
            <CloudOff className="w-4 h-4 text-white/50" title="Local storage only" />
          )}
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse shadow-lg'
            : 'bg-primary text-white hover:bg-primary/90 shadow-card'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isUploading ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8" />
        ) : (
          <Video className="w-8 h-8" />
        )}
      </button>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
        </div>
      )}
      
      {/* Cloud storage indicator */}
      <div className="absolute -bottom-1 -right-1">
        {isPremium ? (
          <Cloud className="w-4 h-4 text-primary" title="Cloud storage enabled" />
        ) : (
          <CloudOff className="w-4 h-4 text-textSecondary" title="Local storage only" />
        )}
      </div>
      
      {/* Error display */}
      {error && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 rounded-md p-2 text-red-700 text-xs whitespace-nowrap flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

export default RecordButton
