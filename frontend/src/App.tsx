import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Stories } from './pages/Stories'
import { SOSButton } from './components/ui/SOSButton'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/sahara" element={<div className="min-h-screen bg-pageBg" />} />
      </Routes>
      <SOSButton />
    </BrowserRouter>
  )
}
