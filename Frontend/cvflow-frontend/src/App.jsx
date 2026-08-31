import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MainFlow from './pages/MainFlow'
import Auth from './pages/paginas-input/Auth'

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/flow" element={<MainFlow />} />
        <Route path='/auth' element={<Auth/>}/>
      </Routes>
    </>
  )
}

export default App
