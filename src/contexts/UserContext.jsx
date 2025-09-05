import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [selectedState, setSelectedState] = useState('California')
  const [subscriptionStatus, setSubscriptionStatus] = useState('free')
  const [savedGuides, setSavedGuides] = useState([])
  const [savedScripts, setSavedScripts] = useState([])
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('knowyourrights_user')
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed.user)
      setSelectedState(parsed.selectedState || 'California')
      setSubscriptionStatus(parsed.subscriptionStatus || 'free')
      setSavedGuides(parsed.savedGuides || [])
      setSavedScripts(parsed.savedScripts || [])
      setIncidents(parsed.incidents || [])
    }
  }, [])

  const saveUserData = (userData) => {
    localStorage.setItem('knowyourrights_user', JSON.stringify(userData))
  }

  const updateSelectedState = (state) => {
    setSelectedState(state)
    saveUserData({
      user,
      selectedState: state,
      subscriptionStatus,
      savedGuides,
      savedScripts,
      incidents
    })
  }

  const upgradeSubscription = () => {
    setSubscriptionStatus('premium')
    saveUserData({
      user,
      selectedState,
      subscriptionStatus: 'premium',
      savedGuides,
      savedScripts,
      incidents
    })
  }

  const saveGuide = (guide) => {
    const updated = [...savedGuides, guide]
    setSavedGuides(updated)
    saveUserData({
      user,
      selectedState,
      subscriptionStatus,
      savedGuides: updated,
      savedScripts,
      incidents
    })
  }

  const saveScript = (script) => {
    const updated = [...savedScripts, script]
    setSavedScripts(updated)
    saveUserData({
      user,
      selectedState,
      subscriptionStatus,
      savedGuides,
      savedScripts: updated,
      incidents
    })
  }

  const addIncident = (incident) => {
    const updated = [...incidents, { ...incident, id: Date.now().toString() }]
    setIncidents(updated)
    saveUserData({
      user,
      selectedState,
      subscriptionStatus,
      savedGuides,
      savedScripts,
      incidents: updated
    })
  }

  const value = {
    user,
    setUser,
    selectedState,
    updateSelectedState,
    subscriptionStatus,
    upgradeSubscription,
    savedGuides,
    saveGuide,
    savedScripts,
    saveScript,
    incidents,
    addIncident,
    isPremium: subscriptionStatus === 'premium'
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}