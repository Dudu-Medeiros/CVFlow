import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Planos.css";
import logo from "../../assets/logo-cvflow-sem-fundo.png";
import {
  ArrowLeft,
  Check,
  UserRound,
  Sparkles,
  BrainCircuit,
  ShieldCheck
} from "lucide-react";

const PLANOS = [
  {
    id: "starter",
    nome: "Starter",
    icone: UserRound,
    precoMensal: "0,00",
    precoTrimestral: "0,00",
    desc: "O essencial para você criar seu primeiro currículo e começar a busca.",
    recursos: [
      "1 Currículo ativo",
      "Modelos de design padrão",
      "Download em PDF com marca d'água",
      "Suporte da comunidade"
    ],
    destaque: false,
    botao: "Começar grátis"
  },
  {
    id: "pro",
    nome: "Pro",
    icone: Sparkles,
    precoMensal: "15,90",
    precoTrimestral: "11,90",
    desc: "Para profissionais que aplicam para múltiplas vagas e buscam flexibilidade.",
    recursos: [
      "Currículos ilimitados",
      "Todos os templates Premium",
      "Sem marca d'água",
      "Duplicação rápida de currículos",
      "Suporte prioritário"
    ],
    destaque: false,
    botao: "Assinar Pro"
  },
  {
    id: "elite",
    nome: "Elite",
    icone: BrainCircuit,
    precoMensal: "29,90",
    precoTrimestral: "22,90",
    desc: "Poder máximo com Inteligência Artificial para furar a fila da triagem.",
    recursos: [
      "Tudo do plano Pro",
      "Consultor IA ilimitado",
      "Análise de Match com vagas",
      "Sugestão de palavras-chave ATS",
      "Reescrita inteligente de experiências"
    ],
    destaque: true,
    botao: "Desbloquear Elite"
  }
];

const Planos = () => {
  const navigate = useNavigate();
  const [isTrimestral, setIsTrimestral] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planos-page">
      <header className="planos-header">
        <div className="planos-header-content">
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          <img src={logo} alt="CVFlow" className="planos-logo" onClick={() => navigate("/")} />
          <div className="spacer"></div>
        </div>
      </header>

      <main className={`planos-main ${isVisible ? "animate-in" : ""}`}>
        <div className="planos-titles">
          <div className="badge-planos pulse-glow">
            <ShieldCheck size={14} /> Transação 100% Segura
          </div>
          <h1>Invista no seu <span className="text-gradient">futuro.</span></h1>
          <p>Cancele quando quiser. Planos desenhados para você conseguir o emprego mais rápido.</p>
        </div>

        <div className="toggle-container">
          <span className={`toggle-label ${!isTrimestral ? "active" : ""}`}>Mensal</span>
          <button 
            className={`toggle-switch ${isTrimestral ? "toggled" : ""}`}
            onClick={() => setIsTrimestral(!isTrimestral)}
          >
            <div className="toggle-thumb"></div>
          </button>
          <span className={`toggle-label ${isTrimestral ? "active" : ""}`}>
            Trimestral <span className="discount-badge">-25%</span>
          </span>
        </div>

        <div className="planos-grid">
          {PLANOS.map((plano) => (
            <div key={plano.id} className={`plano-card ${plano.destaque ? "plano-destaque" : ""}`}>
              {plano.destaque && <div className="badge-popular">Mais popular</div>}
              
              <div className="plano-header">
                <plano.icone size={32} className={`plano-icon ${plano.destaque ? "icon-destaque" : ""}`} />
                <h2>{plano.nome}</h2>
              </div>
              
              <div className="plano-pricing">
                <span className="moeda">R$</span>
                <span className="valor">
                  {isTrimestral ? plano.precoTrimestral : plano.precoMensal}
                </span>
                <span className="periodo">/mês</span>
              </div>
              
              {isTrimestral && plano.precoMensal !== "0,00" && (
                <div className="economia">
                  Cobrado R$ {plano.id === "pro" ? "35,70" : "68,70"} a cada 3 meses
                </div>
              )}
              {!isTrimestral && plano.precoMensal !== "0,00" && (
                <div className="economia hidden-space">Espaço invisível</div>
              )}

              <p className="plano-desc">{plano.desc}</p>
              
              <button className={`btn-plano ${plano.destaque ? "btn-destaque" : "btn-normal"}`}>
                {plano.botao}
              </button>
              
              <ul className="plano-recursos">
                {plano.recursos.map((rec, idx) => (
                  <li key={idx}>
                    <Check size={18} className="check-icon" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Planos;