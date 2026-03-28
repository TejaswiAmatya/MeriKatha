import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Feed } from './pages/Feed'
import { Stories } from './pages/Stories'
import { Sahara } from './pages/Sahara'
import { Bot } from './pages/Bot'
import { SOSButton } from './components/ui/SOSButton'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signup" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
          <Route path="/story" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/sahara" element={<ProtectedRoute><Sahara /></ProtectedRoute>} />
          <Route path="/bot" element={<ProtectedRoute><Bot /></ProtectedRoute>} />
        </Routes>
        <SOSButton />
      </BrowserRouter>
    </AuthProvider>
  )
}
