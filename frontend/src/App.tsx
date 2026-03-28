import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { SOSButton } from './components/ui/SOSButton'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<div className="min-h-screen bg-pageBg" />} />
        <Route path="/sahara" element={<div className="min-h-screen bg-pageBg" />} />
      </Routes>
      <SOSButton />
    </BrowserRouter>
  )
}
