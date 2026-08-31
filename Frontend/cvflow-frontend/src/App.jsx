import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import MainFlow from "./pages/mainFlow/MainFlow";
import Auth from "./pages/paginas-input/Auth";
import CurriculoMain from "./pages/mainFlow/CurriculoMain"
import Profile from "./pages/mainFlow/Profile";
import Configs from "./pages/mainFlow/Configs";

import "./App.css";

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/flow" element={<MainFlow />} />
        <Route path="/curriculos" element={<CurriculoMain />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/configuracoes" element={<Configs />} />
        <Route path='/auth' element={<Auth/>}/>
      </Routes>
    </>
  )
}

export default App
