import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Feed } from './pages/Feed'
import { Stories } from './pages/Stories'
import { Sahara } from './pages/Sahara'
import { Bot } from './pages/Bot'
import { SOSButton } from './components/ui/SOSButton'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/sahara" element={<Sahara />} />
        <Route path="/bot" element={<Bot />} />
      </Routes>
      <SOSButton />
    </BrowserRouter>
  )
}
