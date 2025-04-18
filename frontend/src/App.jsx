import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import LandingPage from './components/LandingPage'
import ProblemsPage from './components/ProblemsPage'
import ProblemDetailPage from './components/ProblemDetailPage'
import AuthPage from './components/AuthPage'
import ForgotPassword from './components/ForgotPassword'
import ProfilePage from './components/ProfilePage'
import ApiTester from './components/ApiTester'
import MainLayout from './components/MainLayout'
import FullScreenLayout from './components/FullScreenLayout'
import './components/LandingPage.css'
import './components/ProblemsPage.css'
import './components/ProblemDetailPage.css'
import './components/FullScreenLayout.css'
import './components/AuthPage.css'
import './components/ForgotPassword.css'
import './components/ProfilePage.css'
import './components/Footer.css'
import './components/ApiTester.css'

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(34, 197, 94, 0.3)',
              background: 'rgba(34, 197, 94, 0.1)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route element={<FullScreenLayout />}>
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:titleSlug" element={<ProblemDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/api-tester" element={<ApiTester />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
