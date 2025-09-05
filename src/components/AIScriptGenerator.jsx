import React, { useState } from 'react'
import { Sparkles, Loader, AlertCircle, Check, Copy } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { aiService, aiUtils } from '../services/openai'

const AIScriptGenerator = ({ onScriptGenerated }) => {
  const { selectedState, isPremium } = useUser()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generatedScript, setGeneratedScript] = useState(null)
  const [formData, setFormData] = useState({
    scenario: '',
    customScenario: '',
    language: 'english',
    context: ''
  })

  const scenarios = [
    { value: 'traffic_stop', label: 'Traffic Stop' },
    { value: 'street_encounter', label: 'Street Encounter' },
    { value: 'home_visit', label: 'Home Visit' },
    { value: 'workplace_interaction', label: 'Workplace Interaction' },
    { value: 'protest_demonstration', label: 'Protest/Demonstration' },
    { value: 'custom', label: 'Custom Scenario' }
  ]

  const languages = [
    { value: 'english', label: 'English', premium: false },
    { value: 'spanish', label: 'Spanish', premium: true },
    { value: 'french', label: 'French', premium: true }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      // Validate inputs
      const scenario = formData.scenario === 'custom' ? formData.customScenario : formData.scenario
      const validation = aiUtils.validateScriptParams(scenario, selectedState, formData.language)
      
      if (!validation.isValid) {
        setError(validation.errors.join(', '))
        return
      }

      // Check if AI service is configured
      if (!aiUtils.isConfigured()) {
        setError('AI service is not configured. Please check your API keys.')
        return
      }

      // Check premium features
      const selectedLanguage = languages.find(lang => lang.value === formData.language)
      if (selectedLanguage?.premium && !isPremium) {
        setError('Multi-language scripts require a premium subscription.')
        return
      }

      // Generate script
      const { data, error: aiError } = await aiService.generateScript(
        scenario,
        selectedState,
        formData.language,
        { context: formData.context }
      )

      if (aiError) {
        setError(aiError)
        return
      }

      setGeneratedScript(data)
      if (onScriptGenerated) {
        onScriptGenerated(data)
      }
    } catch (error) {
      console.error('Script generation error:', error)
      setError('Failed to generate script. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    })
  }

  const canGenerate = formData.scenario && (formData.scenario !== 'custom' || formData.customScenario)

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-textPrimary">AI Script Generator</h3>
        {!isPremium && (
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
            Limited Features
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Scenario Selection */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Scenario Type
          </label>
          <select
            value={formData.scenario}
            onChange={(e) => handleInputChange('scenario', e.target.value)}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a scenario...</option>
            {scenarios.map(scenario => (
              <option key={scenario.value} value={scenario.value}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Scenario Input */}
        {formData.scenario === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Describe Your Scenario
            </label>
            <textarea
              value={formData.customScenario}
              onChange={(e) => handleInputChange('customScenario', e.target.value)}
              placeholder="Describe the specific situation you need help with..."
              className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
          </div>
        )}

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {languages.map(language => (
              <option 
                key={language.value} 
                value={language.value}
                disabled={language.premium && !isPremium}
              >
                {language.label} {language.premium && !isPremium ? '(Premium)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Context */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={formData.context}
            onChange={(e) => handleInputChange('context', e.target.value)}
            placeholder="Any specific details about your situation..."
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            canGenerate && !isGenerating
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Generating Script...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate Script</span>
            </div>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Generated Script Display */}
        {generatedScript && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Generated Script: {generatedScript.title}
              </h4>
              <button
                onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}
                className="text-green-600 hover:text-green-800"
                title="Copy script"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Key Phrases */}
              <div>
                <h5 className="font-medium text-green-800 mb-1">Key Phrases:</h5>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {generatedScript.keyPhrases?.map((phrase, index) => (
                    <li key={index}>{phrase}</li>
                  ))}
                </ul>
              </div>

              {/* What to Say */}
              <div>
                <h5 className="font-medium text-green-800 mb-1">What to Say:</h5>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {generatedScript.doSay?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* What NOT to Say */}
              <div>
                <h5 className="font-medium text-green-800 mb-1">What NOT to Say:</h5>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {generatedScript.dontSay?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Explanation */}
              {generatedScript.explanation && (
                <div>
                  <h5 className="font-medium text-green-800 mb-1">Legal Basis:</h5>
                  <p className="text-green-700">{generatedScript.explanation}</p>
                </div>
              )}

              {/* Tips */}
              {generatedScript.tips && generatedScript.tips.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-800 mb-1">Additional Tips:</h5>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    {generatedScript.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-3 text-xs text-green-600">
              Generated for {selectedState} • {new Date(generatedScript.createdAt).toLocaleString()}
            </div>
          </div>
        )}

        {/* Feature Info */}
        <div className="text-xs text-textSecondary bg-bg rounded-md p-3">
          <p className="mb-1">
            <strong>AI-Powered:</strong> Scripts are generated using advanced AI and legal knowledge.
          </p>
          <p className="mb-1">
            <strong>State-Specific:</strong> Tailored for {selectedState} laws and regulations.
          </p>
          <p>
            <strong>Disclaimer:</strong> AI-generated content should be reviewed and is not a substitute for legal advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIScriptGenerator
