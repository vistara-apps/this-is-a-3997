import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Shield, BookOpen, MessageSquare, Video, ArrowRight, Star } from 'lucide-react'
import RecordButton from '../components/RecordButton'

const Home = () => {
  const { selectedState, subscriptionStatus } = useUser()

  const quickActions = [
    {
      title: 'State Guides',
      description: 'Know your rights in your state',
      icon: BookOpen,
      link: '/guides',
      color: 'bg-blue-500'
    },
    {
      title: 'What to Say',
      description: 'Scripts for police interactions',
      icon: MessageSquare,
      link: '/scripts',
      color: 'bg-green-500'
    },
    {
      title: 'Record Incident',
      description: 'Document interactions safely',
      icon: Video,
      link: '/record',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
          <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-textPrimary mb-2">
            Know Your Rights
          </h1>
          <p className="text-textSecondary">
            Essential information and tools for police interactions in {selectedState}
          </p>
        </div>
      </div>

      {/* Emergency Record Button */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-center space-y-3">
          <h2 className="font-semibold text-red-800">Emergency Recording</h2>
          <p className="text-red-600 text-sm">
            Tap to quickly start recording an interaction
          </p>
          <div className="flex justify-center">
            <RecordButton variant="danger" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-textPrimary">Quick Access</h2>
        <div className="grid gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="bg-surface rounded-lg p-4 shadow-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-textPrimary">{action.title}</h3>
                  <p className="text-textSecondary text-sm">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-textSecondary" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium Upgrade CTA */}
      {subscriptionStatus === 'free' && (
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
          <div className="text-center space-y-3">
            <Star className="w-8 h-8 text-accent mx-auto" />
            <h3 className="font-semibold text-textPrimary">Upgrade to Premium</h3>
            <p className="text-textSecondary text-sm">
              Access Spanish scripts, cloud storage, and advanced features
            </p>
            <Link
              to="/profile"
              className="inline-block bg-accent text-white px-6 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              Upgrade for $5/month
            </Link>
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="bg-bg rounded-lg p-4">
        <p className="text-textSecondary text-xs leading-relaxed">
          <strong>Disclaimer:</strong> This app provides general legal information and is not a substitute for legal advice. 
          Laws vary by jurisdiction and situation. For specific legal matters, consult with a qualified attorney.
        </p>
      </div>
    </div>
  )
}

export default Home