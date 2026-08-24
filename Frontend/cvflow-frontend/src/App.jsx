import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MainFlow from './pages/MainFlow'

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/flow" element={<MainFlow />} />
      </Routes>
    </>
  )
}

export default App
