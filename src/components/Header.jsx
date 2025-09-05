import React from 'react'
import { useUser } from '../contexts/UserContext'
import { Shield, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  const { selectedState, subscriptionStatus } = useUser()
  
  return (
    <header className="bg-surface shadow-card border-b border-border">
      <div className="max-w-xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-textPrimary">KnowYourRights</h1>
              <p className="text-xs text-textSecondary">{selectedState}</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            {subscriptionStatus === 'premium' && (
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-sm font-medium">
                PREMIUM
              </span>
            )}
            <Link to="/profile" className="p-2 hover:bg-bg rounded-md transition-colors">
              <Settings className="w-5 h-5 text-textSecondary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header