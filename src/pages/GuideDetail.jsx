import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { guides } from '../data/guides'
import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const GuideDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { savedGuides, saveGuide } = useUser()
  
  const guide = guides.find(g => g.id === id)
  const isSaved = savedGuides.some(g => g.id === id)

  if (!guide) {
    return (
      <div className="max-w-xl mx-auto px-5 py-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-textPrimary">Guide Not Found</h1>
          <p className="text-textSecondary">The guide you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/guides')}
            className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Guides
          </button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    if (!isSaved) {
      saveGuide(guide)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: guide.title,
      text: guide.summary,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(`${guide.title}: ${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-textPrimary mt-6 mb-4">{line.substring(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-textPrimary mt-5 mb-3">{line.substring(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-textPrimary mt-4 mb-2">{line.substring(4)}</h3>
      }
      
      // Bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-textPrimary mb-2">{line.slice(2, -2)}</p>
      }
      
      // List items
      if (line.startsWith('- ')) {
        return <li key={index} className="text-textPrimary mb-1 ml-4">{line.substring(2)}</li>
      }
      if (line.match(/^\d+\. /)) {
        return <li key={index} className="text-textPrimary mb-1 ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />
      }
      
      // Regular paragraphs
      return <p key={index} className="text-textPrimary mb-3 leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/guides')}
          className="flex items-center space-x-2 text-textSecondary hover:text-textPrimary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-textSecondary" />
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <Share2 className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      </div>

      {/* Guide Content */}
      <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-md font-medium">
              {guide.state}
            </span>
            <span className="text-textSecondary text-sm">
              Updated {new Date(guide.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-3">{guide.title}</h1>
          <p className="text-textSecondary">{guide.summary}</p>
        </div>
        
        <div className="prose prose-sm max-w-none">
          {formatContent(guide.content)}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-bg rounded-lg p-4 mt-6">
        <p className="text-textSecondary text-xs leading-relaxed">
          <strong>Disclaimer:</strong> This information is for educational purposes only and should not be construed as legal advice. 
          Laws can change and vary by jurisdiction. For specific legal situations, consult with a qualified attorney in your area.
        </p>
      </div>
    </div>
  )
}

export default GuideDetail