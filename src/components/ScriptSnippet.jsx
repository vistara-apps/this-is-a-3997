import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Lock, Bookmark, BookmarkCheck } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const ScriptSnippet = ({ script, variant = 'default' }) => {
  const { isPremium, savedScripts, saveScript } = useUser()
  const isPremiumScript = script.language === 'Spanish' || script.premium
  const canAccess = !isPremiumScript || isPremium
  const isSaved = savedScripts.some(s => s.id === script.id)
  
  const handleSave = (e) => {
    e.preventDefault()
    if (!isSaved && canAccess) {
      saveScript(script)
    }
  }

  if (variant === 'premium') {
    return (
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
        <div className="flex items-center mb-3">
          <Lock className="w-5 h-5 text-accent mr-2" />
          <h3 className="font-semibold text-textPrimary">{script.title}</h3>
        </div>
        <p className="text-textSecondary text-sm mb-4">{script.preview}</p>
        <Link 
          to={`/scripts/${script.id}`}
          className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Upgrade for Access
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center mb-2">
          <MessageSquare className="w-5 h-5 text-primary mr-2" />
          <h3 className="font-semibold text-textPrimary">{script.title}</h3>
          {isPremiumScript && (
            <Lock className="w-4 h-4 text-accent ml-2" />
          )}
        </div>
        {canAccess && (
          <button
            onClick={handleSave}
            className="ml-3 p-2 hover:bg-bg rounded-md transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-textSecondary" />
            )}
          </button>
        )}
      </div>
      
      <p className="text-textSecondary text-sm mb-3">{script.scenario}</p>
      <div className="bg-bg p-3 rounded-md mb-4">
        <p className="text-textPrimary text-sm font-medium">
          {canAccess ? `"${script.preview}"` : 'Premium content - upgrade to view'}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-sm font-medium">
            {script.language}
          </span>
          {script.scenario && (
            <span className="text-textSecondary text-xs">
              {script.scenario}
            </span>
          )}
        </div>
        <Link 
          to={`/scripts/${script.id}`}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            canAccess 
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          {canAccess ? 'View Script' : 'Upgrade'}
        </Link>
      </div>
    </div>
  )
}

export default ScriptSnippet