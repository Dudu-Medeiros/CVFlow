import '../pages/Landing.css'
import logo from '../assets/logo-cvflow-sem-fundo.png'
import curriculoMain from '../assets/curriculo-picture-main.png'
import curriculoIlustrativo from '../assets/curriculo-picture-main.png'

import {
  ArrowRight,
  FileText,
  Sparkles,
  Target,
  Download,
  Menu,
  X,
  Workflow,
  Info,
  Layers, 
  Clock, 
  Zap
} from "lucide-react";

const Landing = () => {
  return (
  <>
    <header>
      <div className="header-container">
        <div className='logo'>
          <img src={logo} alt="Logo CVFlow" />
        </div>
      <nav>
        <ul className='nav'>
          <li>
            <Layers size={15}/>
            <a href="#recursos">Recursos</a>
          </li>
          <li>
            <Workflow size={15}/>
            <a href="#funcionamento">Como funciona</a>
          </li>
          <li>
            <Info size={15}/>
            <a href="#sobre">Sobre</a>
          </li>
        </ul>
      </nav>
      
      <div className='botoes-header'>
        <button className='login'>Entrar</button>
        <button className='cadastro'>Começar grátis</button>
      </div>

      </div>
    </header>

    <main>
      <section className='s1'>

        <div className="caixa-left">
          <div className="badge">
            <Sparkles size={14} />
            <span>Crie. Otimize. Conquiste.</span>
          </div>
          <div className='caixa-texto'>
            <h2>Seu currículo,</h2>
            <h2>Sua melhor</h2>
            <h2 className='destaque'>Oportunidade.</h2>
            <div className="resumo">
              <p>Crie currículos profissionais, otimize com palavras-chave</p>
              <p>e aumente suas chances de ser selecionado para as</p>
              <p>melhores oportunidades.</p>
            </div>

            <div className="caixa-botoes">
              <button className='b1-main'>Criar meu curriculo grátis <ArrowRight size={15}/></button>
              <button className='b2-main'>Ver exemplo</button>
            </div>

            <div className="area-tempo">
              <div className="c1-area-tempo">
                <Clock size={16}/>
                <span>Pronto em menos de 5 minutos</span>
              </div>
              
              <div className="c2-area-tempo">
                <Zap size={16}/>
                <span>Rápido e prático</span>
              </div>
            </div>
          </div>
        </div>

        <div className="caixa-right">
          <img src={curriculoIlustrativo} alt="Currículo ilustrativo" />
        </div>

      </section>

      <section className='s2'>
        <h2>Recursos que te ajudam a se destacar</h2>
      </section>
    </main>
  </>
  )
}

export default Landing