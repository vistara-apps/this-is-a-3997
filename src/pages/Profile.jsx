import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { 
  User, 
  MapPin, 
  Crown, 
  Star, 
  Bookmark, 
  Video, 
  Settings,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

const Profile = () => {
  const { 
    selectedState, 
    updateSelectedState, 
    subscriptionStatus, 
    upgradeSubscription,
    savedGuides,
    savedScripts,
    incidents,
    isPremium
  } = useUser()
  
  const [showIncidents, setShowIncidents] = useState(false)

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe
    if (confirm('Upgrade to Premium for $5/month? (This is a demo - no actual payment will be processed)')) {
      upgradeSubscription()
      alert('Upgrade successful! You now have premium access.')
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      localStorage.removeItem('knowyourrights_user')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-textPrimary">Profile</h1>
      </div>

      {/* Subscription Status */}
      <div className={`rounded-lg p-6 border ${
        isPremium 
          ? 'bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20'
          : 'bg-surface border-border'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isPremium ? (
              <Crown className="w-6 h-6 text-accent" />
            ) : (
              <Star className="w-6 h-6 text-textSecondary" />
            )}
            <h2 className="text-lg font-semibold text-textPrimary">
              {isPremium ? 'Premium Member' : 'Free Account'}
            </h2>
          </div>
          {isPremium && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-md font-medium">
              ACTIVE
            </span>
          )}
        </div>
        
        {isPremium ? (
          <div className="space-y-2">
            <p className="text-textSecondary text-sm">
              ✓ Spanish scripts and translations
            </p>
            <p className="text-textSecondary text-sm">
              ✓ Shareable incident cards
            </p>
            <p className="text-textSecondary text-sm">
              ✓ Advanced AI-generated advice
            </p>
            <p className="text-textSecondary text-sm">
              ✓ Priority support
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-textSecondary text-sm">
              Upgrade to access premium features including Spanish scripts, 
              shareable incident cards, and advanced AI support.
            </p>
            <button
              onClick={handleUpgrade}
              className="w-full bg-accent text-white py-2 px-4 rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              Upgrade to Premium - $5/month
            </button>
          </div>
        )}
      </div>

      {/* State Selection */}
      <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-textPrimary">Your State</h2>
        </div>
        
        <select
          value={selectedState}
          onChange={(e) => updateSelectedState(e.target.value)}
          className="w-full p-3 border border-border rounded-md text-textPrimary bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <p className="text-textSecondary text-sm mt-2">
          Legal guides and information will be tailored to your selected state.
        </p>
      </div>

      {/* Saved Content Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg p-4 shadow-card border border-border text-center">
          <Bookmark className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{savedGuides.length}</p>
          <p className="text-textSecondary text-sm">Saved Guides</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 shadow-card border border-border text-center">
          <Bookmark className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{savedScripts.length}</p>
          <p className="text-textSecondary text-sm">Saved Scripts</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4 shadow-card border border-border text-center">
          <Video className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-textPrimary">{incidents.length}</p>
          <p className="text-textSecondary text-sm">Incidents</p>
        </div>
      </div>

      {/* Incidents Section */}
      {incidents.length > 0 && (
        <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-textPrimary">Your Incidents</h2>
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
            >
              {showIncidents ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </>
              )}
            </button>
          </div>
          
          {showIncidents && (
            <div className="space-y-3">
              {incidents.map(incident => (
                <div key={incident.id} className="bg-bg rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-textPrimary text-sm font-medium">
                      {new Date(incident.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-textSecondary text-xs">
                      {incident.location}
                    </p>
                  </div>
                  {incident.notes && (
                    <p className="text-textSecondary text-sm">{incident.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings */}
      <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-textPrimary">Settings</h2>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center">
        <p className="text-textSecondary text-xs">
          KnowYourRights Aid v1.0.0
        </p>
      </div>
    </div>
  )
}

export default Profile