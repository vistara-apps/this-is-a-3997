import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { guides } from '../data/guides'
import GuideCard from '../components/GuideCard'
import { Search, Filter, MapPin } from 'lucide-react'

const Guides = () => {
  const { selectedState, updateSelectedState } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [showStateSelector, setShowStateSelector] = useState(false)

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

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = guide.state === selectedState
    return matchesSearch && matchesState
  })

  return (
    <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-textPrimary">Legal Guides</h1>
        
        {/* State Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStateSelector(!showStateSelector)}
            className="w-full bg-surface border border-border rounded-md p-3 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-textSecondary" />
              <span className="text-textPrimary">{selectedState}</span>
            </div>
            <Filter className="w-4 h-4 text-textSecondary" />
          </button>
          
          {showStateSelector && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
              {states.map(state => (
                <button
                  key={state}
                  onClick={() => {
                    updateSelectedState(state)
                    setShowStateSelector(false)
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-bg transition-colors ${
                    state === selectedState ? 'bg-primary/10 text-primary' : 'text-textPrimary'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-md text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {filteredGuides.length > 0 ? (
          filteredGuides.map(guide => (
            <GuideCard key={guide.id} guide={guide} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-textSecondary mb-4">
              No guides found for {selectedState}
            </p>
            <p className="text-textSecondary text-sm">
              We're working on adding guides for all states. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Coming Soon Notice */}
      {selectedState !== 'California' && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-accent text-sm text-center">
            <strong>Coming Soon:</strong> Guides for {selectedState} are being prepared by our legal team. 
            California guides are available now as a preview.
          </p>
        </div>
      )}
    </div>
  )
}

export default Guides