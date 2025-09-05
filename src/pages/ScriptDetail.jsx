import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { scripts } from '../data/scripts'
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, Copy, Lock, Crown } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const ScriptDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { savedScripts, saveScript, isPremium, upgradeSubscription } = useUser()
  const [copied, setCopied] = useState(false)
  
  const script = scripts.find(s => s.id === id)
  const isSaved = savedScripts.some(s => s.id === id)
  const isPremiumScript = script?.language === 'Spanish' || script?.premium
  const canAccess = !isPremiumScript || isPremium

  if (!script) {
    return (
      <div className="max-w-xl mx-auto px-5 py-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-textPrimary">Script Not Found</h1>
          <p className="text-textSecondary">The script you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/scripts')}
            className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Scripts
          </button>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    if (!isSaved && canAccess) {
      saveScript(script)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: script.title,
      text: script.scenario,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(`${script.title}: ${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }

  const handleCopy = async () => {
    if (canAccess) {
      try {
        await navigator.clipboard.writeText(script.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.log('Error copying:', error)
      }
    }
  }

  const handleUpgrade = () => {
    if (confirm('Upgrade to Premium for $5/month? (This is a demo - no actual payment will be processed)')) {
      upgradeSubscription()
      alert('Upgrade successful! You now have premium access.')
    }
  }

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-textPrimary mb-3 text-lg">{line.slice(2, -2)}</p>
      }
      
      // Quoted text
      if (line.startsWith('"') && line.endsWith('"')) {
        return (
          <div key={index} className="bg-primary/5 border-l-4 border-primary p-4 mb-3 rounded-r-md">
            <p className="text-textPrimary font-medium italic">{line}</p>
          </div>
        )
      }
      
      // List items
      if (line.startsWith('- ')) {
        return <li key={index} className="text-textSecondary mb-1 ml-4">{line.substring(2)}</li>
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />
      }
      
      // Regular paragraphs
      return <p key={index} className="text-textSecondary mb-3 leading-relaxed">{line}</p>
    })
  }

  if (!canAccess) {
    return (
      <div className="max-w-xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/scripts')}
            className="flex items-center space-x-2 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Premium Upgrade Prompt */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-textPrimary">Premium Content</h1>
            <p className="text-textSecondary">
              This script requires a premium subscription to access.
            </p>
          </div>

          <div className="bg-surface rounded-lg p-4 my-6">
            <div className="flex items-center space-x-3 mb-3">
              <Lock className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-textPrimary">{script.title}</h3>
            </div>
            <p className="text-textSecondary text-sm mb-3">{script.scenario}</p>
            <div className="bg-bg p-3 rounded-md">
              <p className="text-textSecondary text-sm">
                "Premium content preview not available - upgrade to view full script"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-textPrimary mb-2">Premium Features Include:</h3>
              <ul className="text-textSecondary text-sm space-y-1">
                <li>✓ Spanish scripts and translations</li>
                <li>✓ Advanced AI-generated advice</li>
                <li>✓ Shareable incident cards</li>
                <li>✓ Cloud storage and sync</li>
              </ul>
            </div>
            
            <button
              onClick={handleUpgrade}
              className="w-full bg-accent text-white py-3 px-6 rounded-md font-semibold hover:bg-accent/90 transition-colors"
            >
              Upgrade to Premium - $5/month
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/scripts')}
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
            onClick={handleCopy}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : 'text-textSecondary'}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <Share2 className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      </div>

      {/* Script Content */}
      <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-md font-medium">
                {script.language}
              </span>
              {isPremiumScript && (
                <span className="bg-accent/10 text-accent text-sm px-2 py-1 rounded-md font-medium">
                  PREMIUM
                </span>
              )}
            </div>
            <span className="text-textSecondary text-sm">
              Updated {new Date(script.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-3">{script.title}</h1>
          <p className="text-textSecondary">{script.scenario}</p>
        </div>
        
        <div className="space-y-4">
          {formatContent(script.content)}
        </div>
        
        {copied && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm text-center">
              Script copied to clipboard!
            </p>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="bg-bg rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-textPrimary mb-2">Usage Tips</h3>
        <ul className="text-textSecondary text-sm space-y-1">
          <li>• Practice saying these phrases calmly and clearly</li>
          <li>• Remain polite and respectful at all times</li>
          <li>• Do not deviate from the script or engage in arguments</li>
          <li>• Remember: you have the right to remain silent</li>
          <li>• Stay calm even if the officer becomes aggressive</li>
        </ul>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-bg rounded-lg p-4 mt-4">
        <p className="text-textSecondary text-xs leading-relaxed">
          <strong>Disclaimer:</strong> These scripts are educational tools and should be adapted to your specific situation. 
          Always prioritize your safety and comply with lawful orders. For specific legal advice, consult with an attorney.
        </p>
      </div>
    </div>
  )
}

export default ScriptDetail