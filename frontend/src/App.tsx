import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Stories } from './pages/Stories'
import { Sahara } from './pages/Sahara'
import { Bot } from './pages/Bot'
import { SOSButton } from './components/ui/SOSButton'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/sahara" element={<Sahara />} />
        <Route path="/bot" element={<Bot />} />
      </Routes>
      <SOSButton />
    </BrowserRouter>
  )
}
