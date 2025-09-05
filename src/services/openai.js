import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

// OpenAI service for AI-powered features
export const aiService = {
  // Generate custom "What to Say" scripts based on scenario and state
  async generateScript(scenario, state, language = 'english', userContext = {}) {
    try {
      const prompt = `
You are a legal rights advisor helping people understand what to say during police interactions. 
Generate a calm, respectful, and legally sound script for the following scenario:

Scenario: ${scenario}
State: ${state}
Language: ${language}
User Context: ${JSON.stringify(userContext)}

Requirements:
1. The script should be de-escalating and respectful
2. Include specific legal rights relevant to ${state}
3. Provide clear, simple phrases that are easy to remember under stress
4. Include both what TO say and what NOT to say
5. Keep responses concise and practical
6. Focus on constitutional rights (4th, 5th, 6th amendments)
7. Include state-specific variations where applicable

Format the response as a JSON object with the following structure:
{
  "title": "Brief title for this script",
  "scenario": "${scenario}",
  "state": "${state}",
  "language": "${language}",
  "keyPhrases": [
    "List of 3-5 key phrases to use"
  ],
  "doSay": [
    "List of things TO say"
  ],
  "dontSay": [
    "List of things NOT to say"
  ],
  "explanation": "Brief explanation of the legal basis",
  "tips": [
    "Additional practical tips"
  ]
}
`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable legal rights advisor who helps people understand their constitutional rights during police interactions. Always provide accurate, helpful, and de-escalating advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3 // Lower temperature for more consistent, factual responses
      })

      const response = completion.choices[0].message.content
      const scriptData = JSON.parse(response)
      
      return {
        data: {
          ...scriptData,
          id: `ai-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isAiGenerated: true
        },
        error: null
      }
    } catch (error) {
      console.error('Error generating script:', error)
      return {
        data: null,
        error: error.message || 'Failed to generate script'
      }
    }
  },

  // Generate shareable incident card content
  async generateIncidentCard(incidentData) {
    try {
      const prompt = `
Generate a professional, shareable incident summary card based on the following information:

Incident Data:
- Timestamp: ${incidentData.timestamp}
- Location: ${incidentData.location || 'Not specified'}
- Notes: ${incidentData.notes || 'No additional notes'}
- Duration: ${incidentData.duration || 'Not specified'}

Create a concise, factual summary that could be shared with legal counsel, family, or advocacy groups.
Include relevant legal context and next steps.

Format as JSON:
{
  "title": "Incident Summary",
  "summary": "Brief factual summary",
  "details": {
    "timestamp": "${incidentData.timestamp}",
    "location": "${incidentData.location || 'Not specified'}",
    "duration": "${incidentData.duration || 'Not specified'}"
  },
  "keyPoints": [
    "List of important points from the incident"
  ],
  "recommendedActions": [
    "List of recommended next steps"
  ],
  "legalContext": "Brief explanation of relevant rights",
  "resources": [
    "List of helpful resources or contacts"
  ]
}
`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal documentation assistant helping people create professional incident reports. Focus on factual, objective language and helpful next steps."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.2
      })

      const response = completion.choices[0].message.content
      const cardData = JSON.parse(response)
      
      return {
        data: {
          ...cardData,
          id: `card-${Date.now()}`,
          createdAt: new Date().toISOString(),
          incidentId: incidentData.id
        },
        error: null
      }
    } catch (error) {
      console.error('Error generating incident card:', error)
      return {
        data: null,
        error: error.message || 'Failed to generate incident card'
      }
    }
  },

  // Generate state-specific legal guidance
  async generateStateGuidance(state, topic) {
    try {
      const prompt = `
Provide specific legal guidance for ${state} regarding ${topic} during police interactions.

Focus on:
1. State-specific laws and regulations
2. Recent legal precedents in ${state}
3. Practical advice for residents
4. Key differences from federal law
5. Contact information for local legal aid

Format as JSON:
{
  "state": "${state}",
  "topic": "${topic}",
  "title": "Brief title",
  "overview": "Overview of the topic in this state",
  "specificLaws": [
    "List of relevant state laws"
  ],
  "practicalAdvice": [
    "List of practical tips"
  ],
  "keyDifferences": "How this differs from federal law",
  "resources": [
    "Local legal aid contacts and resources"
  ],
  "lastUpdated": "${new Date().toISOString()}"
}
`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal research assistant specializing in state-specific police interaction laws. Provide accurate, up-to-date information with proper disclaimers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.2
      })

      const response = completion.choices[0].message.content
      const guidanceData = JSON.parse(response)
      
      return {
        data: {
          ...guidanceData,
          id: `guidance-${Date.now()}`,
          createdAt: new Date().toISOString()
        },
        error: null
      }
    } catch (error) {
      console.error('Error generating state guidance:', error)
      return {
        data: null,
        error: error.message || 'Failed to generate guidance'
      }
    }
  },

  // Translate existing scripts to different languages
  async translateScript(scriptContent, targetLanguage) {
    try {
      const prompt = `
Translate the following legal script to ${targetLanguage}, maintaining legal accuracy and cultural sensitivity:

Original Script:
${JSON.stringify(scriptContent)}

Requirements:
1. Maintain legal accuracy
2. Use culturally appropriate language
3. Keep the same structure and format
4. Ensure phrases are easy to pronounce under stress
5. Include phonetic pronunciation guide if needed

Return the translated script in the same JSON format as the original.
`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional legal translator specializing in police interaction scripts. Maintain accuracy while ensuring cultural appropriateness."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })

      const response = completion.choices[0].message.content
      const translatedScript = JSON.parse(response)
      
      return {
        data: {
          ...translatedScript,
          id: `translated-${Date.now()}`,
          originalId: scriptContent.id,
          translatedTo: targetLanguage,
          createdAt: new Date().toISOString()
        },
        error: null
      }
    } catch (error) {
      console.error('Error translating script:', error)
      return {
        data: null,
        error: error.message || 'Failed to translate script'
      }
    }
  }
}

// Utility functions for AI service
export const aiUtils = {
  // Check if OpenAI API key is configured
  isConfigured() {
    return !!import.meta.env.VITE_OPENAI_API_KEY
  },

  // Get available AI features based on subscription
  getAvailableFeatures(subscriptionStatus) {
    const freeFeatures = ['generateScript']
    const premiumFeatures = ['generateScript', 'generateIncidentCard', 'generateStateGuidance', 'translateScript']
    
    return subscriptionStatus === 'premium' ? premiumFeatures : freeFeatures
  },

  // Validate script generation parameters
  validateScriptParams(scenario, state, language) {
    const errors = []
    
    if (!scenario || scenario.trim().length < 5) {
      errors.push('Scenario must be at least 5 characters long')
    }
    
    if (!state || state.trim().length < 2) {
      errors.push('State is required')
    }
    
    const supportedLanguages = ['english', 'spanish', 'french']
    if (!supportedLanguages.includes(language.toLowerCase())) {
      errors.push('Language not supported')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
