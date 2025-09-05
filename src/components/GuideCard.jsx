import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Bookmark, Check } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const GuideCard = ({ guide, variant = 'default' }) => {
  const { savedGuides, saveGuide } = useUser()
  const isSaved = savedGuides.some(g => g.id === guide.id)
  
  const handleSave = (e) => {
    e.preventDefault()
    if (!isSaved) {
      saveGuide(guide)
    }
  }

  if (variant === 'compact') {
    return (
      <Link 
        to={`/guides/${guide.id}`}
        className="block bg-surface rounded-md p-4 shadow-card border border-border hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-textPrimary text-sm">{guide.title}</h3>
            <p className="text-textSecondary text-xs mt-1">{guide.state}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-textSecondary" />
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-textPrimary text-lg mb-2">{guide.title}</h3>
          <p className="text-textSecondary text-sm mb-3">{guide.summary}</p>
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-sm font-medium">
            {guide.state}
          </span>
        </div>
        <button
          onClick={handleSave}
          className="ml-3 p-2 hover:bg-bg rounded-md transition-colors"
        >
          {isSaved ? (
            <div className="relative">
              <Bookmark className="w-5 h-5 text-primary" />
              <Check className="w-3 h-3 text-primary absolute top-0.5 left-0.5" />
            </div>
          ) : (
            <Bookmark className="w-5 h-5 text-textSecondary" />
          )}
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-textSecondary text-sm">
          Updated {new Date(guide.updatedAt).toLocaleDateString()}
        </span>
        <Link 
          to={`/guides/${guide.id}`}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Read Guide
        </Link>
      </div>
    </div>
  )
}

export default GuideCard
