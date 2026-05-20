import { useState } from 'react'
import LandingPage from './screens/LandingPage'
import MapApp from './screens/MapApp'

export default function App() {
  const [entered, setEntered] = useState(false)

  return entered
    ? <MapApp />
    : <LandingPage onEnter={() => setEntered(true)} />
}
