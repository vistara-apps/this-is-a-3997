import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { RecordingProvider } from './contexts/RecordingContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Guides from './pages/Guides'
import Scripts from './pages/Scripts'
import Record from './pages/Record'
import Profile from './pages/Profile'
import GuideDetail from './pages/GuideDetail'
import ScriptDetail from './pages/ScriptDetail'

function App() {
  return (
    <UserProvider>
      <RecordingProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/:id" element={<GuideDetail />} />
              <Route path="/scripts" element={<Scripts />} />
              <Route path="/scripts/:id" element={<ScriptDetail />} />
              <Route path="/record" element={<Record />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </RecordingProvider>
    </UserProvider>
  )
}

export default App