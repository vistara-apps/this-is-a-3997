import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { scripts } from '../data/scripts'
import ScriptSnippet from '../components/ScriptSnippet'
import { Search, Globe, Lock } from 'lucide-react'

const Scripts = () => {
  const { isPremium } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')

  const languages = ['All', 'English', 'Spanish']
  
  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.scenario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === 'All' || script.language === selectedLanguage
    return matchesSearch && matchesLanguage
  })

  const freeScripts = filteredScripts.filter(script => script.language === 'English' && !script.premium)
  const premiumScripts = filteredScripts.filter(script => script.language === 'Spanish' || script.premium)

  return (
    <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-textPrimary">What to Say Scripts</h1>
        
        {/* Language Filter */}
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-textSecondary" />
          <div className="flex space-x-2">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-primary text-white'
                    : 'bg-surface text-textSecondary border border-border hover:bg-bg'
                }`}
              >
                {lang}
                {lang === 'Spanish' && !isPremium && (
                  <Lock className="w-3 h-3 ml-1 inline" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-md text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Premium Notice */}
      {!isPremium && selectedLanguage !== 'English' && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-accent" />
            <p className="text-accent font-medium">Premium Feature</p>
          </div>
          <p className="text-textSecondary text-sm mt-1">
            Spanish scripts and advanced features require a premium subscription.
          </p>
        </div>
      )}

      {/* Free Scripts */}
      {freeScripts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-textPrimary">Free Scripts</h2>
          {freeScripts.map(script => (
            <ScriptSnippet key={script.id} script={script} />
          ))}
        </div>
      )}

      {/* Premium Scripts */}
      {premiumScripts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-textPrimary">Premium Scripts</h2>
            <Lock className="w-4 h-4 text-accent" />
          </div>
          {premiumScripts.map(script => (
            <ScriptSnippet 
              key={script.id} 
              script={script} 
              variant={isPremium ? 'default' : 'premium'} 
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredScripts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-textSecondary mb-4">No scripts found</p>
          <p className="text-textSecondary text-sm">
            Try adjusting your search terms or language filter.
          </p>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-bg rounded-lg p-4">
        <h3 className="font-semibold text-textPrimary mb-2">Tips for Using Scripts</h3>
        <ul className="text-textSecondary text-sm space-y-1">
          <li>• Practice saying these phrases calmly and clearly</li>
          <li>• Remain polite and respectful at all times</li>
          <li>• Do not deviate from the script or engage in arguments</li>
          <li>• Remember: these are your constitutional rights</li>
        </ul>
      </div>
    </div>
  )
}

export default Scripts