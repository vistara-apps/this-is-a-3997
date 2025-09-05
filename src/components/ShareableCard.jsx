import React from 'react'
import { Share2, Download, MapPin, Clock } from 'lucide-react'

const ShareableCard = ({ incident }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Incident Report - KnowYourRights Aid',
      text: `Incident recorded on ${new Date(incident.timestamp).toLocaleString()}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Incident Report: ${shareData.text} - ${shareData.url}`)
      alert('Incident details copied to clipboard!')
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(incident, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `incident-${incident.id}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
      <h3 className="font-semibold text-textPrimary mb-4">Incident Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-textSecondary" />
          <span className="text-textSecondary">
            {new Date(incident.timestamp).toLocaleString()}
          </span>
        </div>
        
        {incident.location && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-textSecondary" />
            <span className="text-textSecondary">{incident.location}</span>
          </div>
        )}
        
        {incident.notes && (
          <div className="bg-bg p-3 rounded-md">
            <p className="text-textPrimary text-sm">{incident.notes}</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleShare}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="flex-1 bg-bg text-textPrimary py-2 px-4 rounded-md text-sm font-medium hover:bg-border transition-colors flex items-center justify-center space-x-2 border border-border"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}

export default ShareableCard