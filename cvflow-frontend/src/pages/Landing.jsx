import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import logo from "../assets/logo-cvflow-sem-fundo.png";
import modeloCurriculo from "../assets/curriculo-model.jpg";
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
  Rocket,
  BrainCircuit,
  Target,
  Percent,
  X,
  Menu,
  Gem,
  Check
} from "lucide-react";
import { getToken } from "../services/auth";

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

const RECURSOS = [
  { id: 1, icone: FileText, titulo: "Criação Inteligente", descricao: "Esqueça a formatação manual. Preencha seus dados em um fluxo focado.", delay: 100 },
  { id: 2, icone: Sparkles, titulo: "Design Premium", descricao: "Modelos testados e aprovados por recrutadores de grandes empresas tech.", delay: 200 },
  { id: 3, icone: Download, titulo: "Exportação Imediata", descricao: "Gere PDFs perfeitamente otimizados em segundos, sem marcas d'água.", delay: 300 }
];

const PASSOS = [
  { id: 1, icone: UserRound, titulo: "Seus Dados", descricao: "Insira sua trajetória profissional.", delay: 100 },
  { id: 2, icone: SlidersHorizontal, titulo: "Otimize", descricao: "Molde ao seu estilo visual.", delay: 200 },
  { id: 3, icone: FileDown, titulo: "Conquiste", descricao: "Baixe e aplique para a vaga.", delay: 300 }
];

const PLANOS_PREVIEW = [
  { 
    id: "starter", 
    nome: "Starter", 
    preco: "Grátis", 
    icone: UserRound, 
    desc: "Crie seu primeiro currículo e dê o primeiro passo.", 
    destaques: ["1 Currículo ativo", "Templates essenciais", "Download em PDF"] 
  },
  { 
    id: "pro", 
    nome: "Pro", 
    preco: "R$ 15,90", 
    mensal: "/mês", 
    icone: Sparkles, 
    destaque: true, 
    desc: "Para quem aplica para múltiplas vagas.", 
    destaques: ["Currículos ilimitados", "Templates Premium", "Sem marca d'água"] 
  },
  { 
    id: "elite", 
    nome: "Elite", 
    preco: "R$ 29,90", 
    mensal: "/mês", 
    icone: BrainCircuit, 
    desc: "Poder máximo com Inteligência Artificial.", 
    destaques: ["Tudo do plano Pro", "Consultor IA ilimitado", "Análise de Match com vagas"] 
  }
];

const Landing = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalPlano, setModalPlano] = useState(null);
  const navigate = useNavigate();

  const [featuresRef, featuresVisible] = useScrollReveal();
  const [aiRef, aiVisible] = useScrollReveal(0.3);
  const [stepsRef, stepsVisible] = useScrollReveal();
  const [aboutRef, aboutVisible] = useScrollReveal();
  const [plansRef, plansVisible] = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const irParaApp = () => navigate(getToken() ? "/flow" : "/auth");
  const irParaPlanos = () => navigate("/planos");

  return (
    <div className="landing-page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <header className={`modern-header ${scrolled ? "glass-header" : ""}`}>
        <div className="header-content">
          <div className="logo-container" onClick={() => window.scrollTo(0,0)}>
            <img src={logo} alt="CVFlow" className="main-logo" />
          </div>
          <nav className="nav-desktop">
            <a href="#recursos" className="nav-link"><Layers size={14} /> Recursos</a>
            <a href="#consultor" className="nav-link"><BrainCircuit size={14} /> Consultor IA</a>
            <a href="#funcionamento" className="nav-link"><Workflow size={14} /> Como funciona</a>
            <a href="#planos" className="nav-link btn-planos"><Gem size={14} /> Planos</a>
          </nav>
          <div className="header-actions">
            <button className="btn-solid" onClick={irParaApp}>
              Criar Currículo <ArrowRight size={16} />
            </button>
            <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        <div className={`nav-mobile ${menuAberto ? "open" : ""}`}>
          <a href="#recursos" onClick={() => setMenuAberto(false)}>Recursos</a>
          <a href="#consultor" onClick={() => setMenuAberto(false)}>Consultor IA</a>
          <a href="#funcionamento" onClick={() => setMenuAberto(false)}>Como funciona</a>
          <a href="#planos" onClick={() => setMenuAberto(false)} className="mobile-planos">Planos</a>
          <button className="btn-solid w-full mt-4" onClick={() => { setMenuAberto(false); irParaApp(); }}>
            Começar Agora
          </button>
        </div>
      </header>
      <main>
        <section className="hero-section">
          <div className="hero-container reveal-up">
            <div className="badge-modern floating pulse-glow">
              <Sparkles size={14} /> CVFlow 2.0 chegou
            </div>
            <h1 className="hero-title title-animated">
              O currículo que as empresas <br/> querem ler.
            </h1>
            <p className="hero-description">
              Esqueça editores complexos. Construa um currículo magnético em minutos, analise sua compatibilidade com vagas usando IA e destaque-se na multidão.
            </p>
            <div className="hero-buttons">
              <button className="btn-solid btn-xl btn-glow hover-lift" onClick={irParaApp}>
                Começar gratuitamente
              </button>
              <button className="btn-outline btn-xl hover-lift" onClick={() => navigate("/modelos")}>
                Ver modelos
              </button>
            </div>
            <div className="hero-metrics">
              <span><Clock size={16}/> Em 5 minutos</span>
              <span className="dot">•</span>
              <span><BrainCircuit size={16}/> IA Integrada</span>
              <span className="dot">•</span>
              <span><LockKeyhole size={16}/> Dados Seguros</span>
            </div>
          </div>
        </section>

        <section className="features-section" id="recursos" ref={featuresRef}>
          <div className={`section-header ${featuresVisible ? "reveal-up" : "hidden"}`}>
            <h2 className="section-title">Construído para o seu sucesso</h2>
            <p className="section-subtitle">A união perfeita entre design profissional e tecnologia focada na sua contratação.</p>
          </div>
          <div className="features-grid">
            {RECURSOS.map((rec) => (
              <div 
                key={rec.id} 
                className={`feature-card glass-card hover-lift ${featuresVisible ? "reveal-up" : "hidden"}`}
                style={{ transitionDelay: `${rec.delay}ms` }}
              >
                <div className="feature-icon"><rec.icone size={24} /></div>
                <h3>{rec.titulo}</h3>
                <p>{rec.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-section" id="consultor" ref={aiRef}>
          <div className="ai-container">
            <div className={`ai-text-box ${aiVisible ? "reveal-left" : "hidden"}`}>
              <div className="badge-ai floating"><BrainCircuit size={14} /> Novo Recurso V2.0</div>
              <h2 className="ai-title title-animated-light">Consultor de Vagas <br/>com Inteligência Artificial.</h2>
              <p className="ai-desc">
                Não mande currículos no escuro. Nosso motor inteligente lê o seu documento, compara com a descrição da vaga desejada e revela exatamente o que você precisa ajustar.
              </p>
              <ul className="ai-list">
                <li><Target size={20} className="ai-icon-list"/> <strong>Análise de Match:</strong> Descubra a porcentagem de compatibilidade real com a vaga.</li>
                <li><Sparkles size={20} className="ai-icon-list"/> <strong>Recomendações:</strong> Sugestões guiadas do que adicionar ou reescrever.</li>
                <li><Percent size={20} className="ai-icon-list"/> <strong>Pontuação ATS:</strong> Otimização para os robôs dos recrutadores.</li>
              </ul>
            </div>
            <div className={`ai-visual-box ${aiVisible ? "reveal-right" : "hidden"}`}>
              <div className="ai-glass-panel hover-lift">
                <div className="scanner-line"></div>
                <div className="ai-mockup-header">
                  <div className="mockup-dots"><span/><span/><span/></div>
                  <span className="mockup-title">cvflow-analyzer</span>
                </div>
                <div className="ai-mockup-body">
                  <div className="mockup-profile">
                    <div className="avatar-skeleton"></div>
                    <div className="lines-skeleton">
                      <div className="line-sk short"></div>
                      <div className="line-sk long"></div>
                    </div>
                  </div>
                  <div className="ai-match-card floating-delayed">
                    <div className="match-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="circle-progress" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="percentage">92%</text>
                      </svg>
                    </div>
                    <div className="match-info">
                      <h4>Match com a vaga</h4>
                      <p>Desenvolvedor Front-end Sênior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="steps-section" id="funcionamento" ref={stepsRef}>
          <div className={`section-header ${stepsVisible ? "reveal-up" : "hidden"}`}>
            <h2 className="section-title">Três passos para o topo</h2>
          </div>
          <div className="steps-container">
            {PASSOS.map((passo, idx) => (
              <div 
                key={passo.id} 
                className={`step-item hover-scale ${stepsVisible ? "reveal-up" : "hidden"}`}
                style={{ transitionDelay: `${passo.delay}ms` }}
              >
                <div className="step-number">0{passo.id}</div>
                <div className="step-content">
                  <passo.icone size={28} className="step-icon" />
                  <h3>{passo.titulo}</h3>
                  <p>{passo.descricao}</p>
                </div>
                {idx !== PASSOS.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </section>

        <section className="about-section" id="sobre" ref={aboutRef}>
          <div className="about-grid">
            <div className={`about-text-box ${aboutVisible ? "reveal-left" : "hidden"}`}>
              <div className="badge-modern floating">Por que o CVFlow?</div>
              <h2 className="section-title">Sua carreira merece uma apresentação à altura.</h2>
              <p>
                Acreditamos que todos têm potencial. Nossa ferramenta une design impecável à inteligência artificial para que você foque apenas em contar a sua história.
              </p>
              <ul className="about-list">
                <li><ShieldCheck size={20} className="text-blue" /> Privacidade total e dados criptografados.</li>
                <li><UserRound size={20} className="text-blue" /> Focado 100% no sucesso do candidato.</li>
              </ul>
            </div>
            <div className={`about-image-box ${aboutVisible ? "reveal-right" : "hidden"}`}>
              <div className="image-border-glow">
                <img src={modeloCurriculo} alt="Exemplo" className="floating-img hover-scale" />
              </div>
            </div>
          </div>
        </section>

        <section className="plans-preview-section" id="planos" ref={plansRef}>
          <div className={`section-header ${plansVisible ? "reveal-up" : "hidden"}`}>
            <h2 className="section-title">Escolha seu caminho</h2>
            <p className="section-subtitle">Planos estruturados para cada fase da sua jornada profissional.</p>
          </div>
          <div className={`plans-grid ${plansVisible ? "reveal-up" : "hidden"}`}>
            {PLANOS_PREVIEW.map((plano) => (
              <div 
                key={plano.id} 
                className={`plan-card glass-card hover-lift ${plano.destaque ? "highlight" : ""}`}
                onClick={() => setModalPlano(plano)}
              >
                {plano.destaque && <div className="plan-badge">Mais popular</div>}
                <plano.icone size={32} className="plan-icon" />
                <h3>{plano.nome}</h3>
                <div className="plan-price">
                  <span className="value">{plano.preco}</span>
                  {plano.mensal && <span className="period">{plano.mensal}</span>}
                </div>
                <p className="plan-desc">{plano.desc}</p>
                <button className={plano.destaque ? "btn-solid w-full" : "btn-outline w-full"}>
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container glass-card hover-lift pulse-glow">
            <Rocket size={48} className="cta-icon" />
            <h2 className="title-animated">Pronto para a sua próxima oportunidade?</h2>
            <p>Junte-se aos profissionais que estão avançando na carreira com o CVFlow.</p>
            <button className="btn-solid btn-xl" onClick={irParaApp}>
              Criar meu currículo grátis
            </button>
          </div>
        </section>
      </main>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logo} alt="CVFlow" className="footer-logo" />
            <p>Acelerando carreiras, um currículo de cada vez.</p>
          </div>
          <div className="footer-links">
            <a href="#recursos">Recursos</a>
            <a href="#consultor">Consultor IA</a>
            <a href="#funcionamento">Como funciona</a>
            <a href="/planos" onClick={(e) => { e.preventDefault(); irParaPlanos(); }}>Planos</a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} CVFlow. Todos os direitos reservados.</p>
        </div>
      </footer>

      {modalPlano && (
        <div className="modal-overlay" onClick={() => setModalPlano(null)}>
          <div className="modal-box zoom-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPlano(null)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <modalPlano.icone size={28} className="modal-icon" />
              <h3>Plano {modalPlano.nome}</h3>
            </div>
            <p className="modal-desc">{modalPlano.desc}</p>
            <div className="modal-price">
              <span className="value">{modalPlano.preco}</span>
              {modalPlano.mensal && <span className="period">{modalPlano.mensal}</span>}
            </div>
            <ul className="modal-features">
              {modalPlano.destaques.map((item, idx) => (
                <li key={idx}><Check size={18} className="text-blue" /> {item}</li>
              ))}
            </ul>
            <button className="btn-solid w-full mt-4" onClick={irParaPlanos}>
              Conhecer todos os benefícios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Landing;