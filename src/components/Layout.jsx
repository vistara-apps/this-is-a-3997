import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="pb-20">
        {children}
      </main>
      <Navigation currentPath={location.pathname} />
    </div>
  )
}

export default Layout