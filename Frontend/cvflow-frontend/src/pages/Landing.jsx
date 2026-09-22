import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../pages/Landing.css'
import logo from '../assets/logo-cvflow-sem-fundo.png'
import curriculoIlustrativo from '../assets/curriculo-picture-main.png'
import modeloCurriculo from '../assets/curriculo-model.jpg'

import {
  ArrowRight,
  Sparkles,
  Download,
  Workflow,
  Info,
  Layers, 
  Clock, 
  Zap,
  FileText,
  UserRound,
  SlidersHorizontal,
  FileDown,
  ShieldCheck,
  LockKeyhole,
  CircleCheck,
  Rocket,
  X,
  Menu
} from "lucide-react";

const Landing = () => {
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()

  return (
  <>
    <header>
      <div className="header-container">
        <div className='logo'>
          <img src={logo} alt="Logo CVFlow" />
        </div>

      {/* Menu do desktop */}  
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
        <button className='cadastro' onClick={() => navigate('/auth')}>Começar grátis</button>
      </div>

      {/* Mobile */}
      <button className='menu-mobile' onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? <X size={28}/> : <Menu size={28}/>}
      </button>

      </div>

      {menuAberto && (
        <nav className="mobile-nav">

        <a
          href="#recursos"
          onClick={() => setMenuAberto(false)}
        >
          <Layers size={18}/>
          Recursos
        </a>

        <a
          href="#funcionamento"
          onClick={() => setMenuAberto(false)}
        >
          <Workflow size={18}/>
          Como funciona
        </a>

        <a
          href="#sobre"
          onClick={() => setMenuAberto(false)}
        >
          <Info size={18}/>
            Sobre
        </a>

      <button
        className="mobile-cadastro"
        onClick={() => {
          setMenuAberto(false);
          
        }}
      >
        Começar grátis
      </button>

    </nav>
  )}

      
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
              <button className='b1-main' onClick={() => navigate('/auth')}>Criar meu curriculo grátis <ArrowRight size={26} className='arrow'/></button>
              <button className='b2-main' onClick={() => navigate('/modelos')}>Ver exemplo</button>
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

      <section className='s2' id="recursos">
        <h2>Recursos que te ajudam a se destacar</h2>

        <div className="lista-recursos">
          <div className="r1">
            <div className="icone i1">
              <FileText size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Criação simples</h3>
              <p>Preencha seus dados de forma rápida e intuitiva.</p>
            </div>
          </div>
          <div className="r2">
            <div className="icone i2">
              <Sparkles size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Personalização inteligente</h3>
              <p>Organize suas experiências e destaque suas principais habilidades.</p>
            </div>
          </div>
          <div className="r3">
            <div className="icone i3">
              <Download size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Currículo pronto para enviar</h3>
              <p>Gere seu currículo em PDF com um visual profissional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='s3' id="funcionamento">
        <div className="badge">
          <span>Como funciona</span>
        </div>
        <div className='caixa-texto'>
          <h2>Criar seu currículo é simples,</h2>
          <h2 className='destaque'>Rápido e eficiente</h2>
          <div className="resumo">
            <p>siga 3 passos e tenha um currículo profissional pronto para</p>
            <p>a próxima oportunidade</p>
          </div>
        </div>
        <div className="lista-recursos">
          <div className="r1">
            <div className='icone i1'>
              <UserRound size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Preencha seus dados</h3>
              <p>informação pessoais, experiência, formação, habilidades e muito mais de forma intuitiva.</p>
            </div>
          </div>
          <ArrowRight size={40} className='arrow-blue'/>
          <div className="r2">
            <div className="icone i2">
              <SlidersHorizontal size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Personalize seu currículo</h3>
              <p>Escolha o modelo, organize as seções e destaque o que realmente importa para sua área.</p>
            </div>
          </div>
          <ArrowRight size={40} className='arrow-blue'/>
          <div className="r3">
            <div className="icone i3">
              <FileDown size={30} className='icon-recursos'/>
            </div>
            <div className="texto-recursos">
              <h3>Gere e baixe em PDF</h3>
              <p>seu currículo pronto para enviar, com um layout profissional e de alta qualidade</p>
            </div>
          </div>
        </div>
      </section>

      <section className="s4" id="sobre">
        <div className="box-s4">
          <div className="box-left-s4">
            <div className='badge'>
              <span>Sobre o cvflow</span>
            </div>
            <div className="caixa-texto">
              <h2>Feito pra te ajudar a</h2>
              <h2>chegar <span className='destaque'>mais longe</span>.</h2>
              <div className="caixa-p">
                <p>O CVFlow nasceu com o objetivo de simplificar o processo de criação de currículos e ajudar você a se apresentar da
                melhor forma para o mercado
                </p>
                <p>Acreditamos que todos têm potencial e merecem oportunidades. Por isso, oferecemos uma ferramenta simples, moderna
                e eficiente para destacar suas habilidades e experiências.
                </p>
              </div>
            </div>

            <div className="sobre-item">
              <div className='textos-sobre'>
                <ShieldCheck size={25} className='icon'/>
                <h4>Seguro e confiável</h4>
                <p>Seus dados protegidos durante todo o processo.</p>
              </div>

              <div className='textos-sobre'>
                <LockKeyhole size={25} className='icon'/>
                <h4>Proteção total</h4>
                <p>Seus dados utilizados apenas para seu currículo.</p>
              </div>

              <div className='textos-sobre'>
                <CircleCheck size={25} className='icon'/>
                <h4>Uso fácil</h4>
                <p>Crie seu currículo de forma simples e sem complicações.</p>
              </div>
            </div>

          </div>
          <div className="box-right-s4">
            <img src={modeloCurriculo} alt="Modelo do currículo" />
          </div>
        </div>

        <div className="box-bottom-s4">
          <div className="icone">
            <Rocket size={30}/>
          </div>
          <div className="textos">
            <h4>Pronto para criar seu currículo?</h4>
            <p>Comece agora e dê o próximo passo rumo ao seu futuro.</p>
          </div>
          <div>
            <button onClick={() => navigate('/auth')}>Criar meu currículo grátis <ArrowRight/> </button>
          </div>
        </div>
        
      </section>
    </main>

    <footer>
      <div className="footer-top">

        <div className="campo-img">
          <img src={logo} alt="Logo CVFlow" />
          <p>Seu currículo, sua melhor oportunidade.</p>
        </div>

        <nav className="footer-nav">
          <a href="#recursos">Recursos</a>
          <a href="#funcionamento">Como funciona</a>
          <a href="#sobre">Sobre</a>
        </nav>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 CVFlow. Todos os direitos reservados.</p>
        </div>
    </footer>
  </>
  )
}

export default Landing