import React from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, MessageSquare, Video, User } from 'lucide-react'

const Navigation = ({ currentPath }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/guides', icon: BookOpen, label: 'Guides' },
    { path: '/scripts', icon: MessageSquare, label: 'Scripts' },
    { path: '/record', icon: Video, label: 'Record' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
      <div className="max-w-xl mx-auto px-5">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = currentPath === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-md transition-colors ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-bg'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation