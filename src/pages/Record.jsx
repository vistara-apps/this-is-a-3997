import React, { useState } from 'react'
import { useRecording } from '../contexts/RecordingContext'
import { useUser } from '../contexts/UserContext'
import RecordButton from '../components/RecordButton'
import ShareableCard from '../components/ShareableCard'
import { MapPin, FileText, Save, AlertTriangle } from 'lucide-react'

const Record = () => {
  const { 
    isRecording, 
    recordingTime, 
    recordedBlob, 
    formatTime, 
    resetRecording 
  } = useRecording()
  
  const { addIncident, isPremium } = useUser()
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [savedIncident, setSavedIncident] = useState(null)

  const handleSaveIncident = () => {
    if (recordedBlob) {
      const incident = {
        timestamp: new Date().toISOString(),
        location: location || 'Not specified',
        notes,
        recordingPath: URL.createObjectURL(recordedBlob),
        duration: recordingTime
      }
      
      addIncident(incident)
      setSavedIncident(incident)
      setNotes('')
      setLocation('')
      resetRecording()
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get location. Please enter manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  if (savedIncident) {
    return (
      <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Save className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">Incident Saved</h1>
          <p className="text-textSecondary">
            Your recording and incident details have been saved securely.
          </p>
        </div>

        {isPremium && <ShareableCard incident={savedIncident} />}

        <div className="space-y-3">
          <button
            onClick={() => setSavedIncident(null)}
            className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Record Another Incident
          </button>
          
          {!isPremium && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-accent text-sm text-center">
                <strong>Upgrade to Premium</strong> to access shareable incident cards and cloud storage.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-textPrimary">Record Incident</h1>
        <p className="text-textSecondary">
          Document police interactions safely and securely
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-red-800 text-sm">
            <p className="font-medium mb-1">Important Safety Reminders:</p>
            <ul className="space-y-1 text-xs">
              <li>• Keep your phone visible and announce you are recording</li>
              <li>• Do not interfere with police duties</li>
              <li>• Remain calm and follow lawful orders</li>
              <li>• Focus on de-escalation, not confrontation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
        <div className="text-center space-y-6">
          {/* Recording Status */}
          <div className="space-y-2">
            {isRecording ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-red-600 font-medium">Recording in Progress</p>
                <p className="text-2xl font-mono text-textPrimary">
                  {formatTime(recordingTime)}
                </p>
              </>
            ) : recordedBlob ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                <p className="text-green-600 font-medium">Recording Complete</p>
                <p className="text-textSecondary">
                  Duration: {formatTime(recordingTime)}
                </p>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-gray-400 rounded-full mx-auto"></div>
                <p className="text-textSecondary">Ready to Record</p>
              </>
            )}
          </div>

          {/* Record Button */}
          <div className="flex justify-center">
            <RecordButton />
          </div>

          {/* Instructions */}
          <p className="text-textSecondary text-sm">
            {isRecording 
              ? 'Tap the square button to stop recording'
              : 'Tap the record button to start audio/video recording'
            }
          </p>
        </div>
      </div>

      {/* Post-Recording Form */}
      {recordedBlob && !isRecording && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-textPrimary">Incident Details</h2>
          
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textPrimary">
              Location
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or coordinates"
                className="flex-1 px-3 py-2 border border-border rounded-md text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={getLocation}
                className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textPrimary">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what happened, officer details, witness information, etc."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveIncident}
            className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Incident</span>
          </button>
        </div>
      )}

      {/* Legal Notice */}
      <div className="bg-bg rounded-lg p-4">
        <p className="text-textSecondary text-xs leading-relaxed">
          <strong>Legal Notice:</strong> Recording laws vary by state. In most states, you have the right to record police 
          in public spaces. This app stores recordings locally on your device. For legal advice about recording 
          laws in your area, consult with an attorney.
        </p>
      </div>
    </div>
  )
}

export default Record