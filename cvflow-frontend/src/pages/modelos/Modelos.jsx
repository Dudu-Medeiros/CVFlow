import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  FileText,
  X,
  Star
} from "lucide-react";
import logo from "../../assets/logo-cvflow-sem-fundo.png";
import { useAuth } from "../../hooks/useAuth";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import "./Modelos.css";

const dadosPreview = {
  nome: "Nome Sobrenome",
  cargo: "Especialista na sua área",
  email: "contato@email.com",
  telefone: "(11) 99999-9999",
  localizacao: "São Paulo, SP",
  resumo: "Profissional dedicado com foco em resultados, otimização de processos e trabalho em equipe para alcançar objetivos de alta performance no ambiente corporativo.",
  habilidades: [{ id: 1, nome: "Comunicação" }, { id: 2, nome: "Liderança" }],
  experiencias: [{ id: 1, empresa: "Nome da Empresa", funcao: "Cargo Principal", periodo: "2022 - Atual", atividades: "Gestão de projetos e equipes." }]
};

const modelos = [
  {
    id: "minimalista",
    nome: "Minimalista",
    descricao: "Modelo limpo, direto e em preto e branco. Ideal para iniciar.",
    categoria: "Clássico",
    premium: false
  },
  {
    id: "moderno",
    nome: "Moderno",
    descricao: "Layout visual com duas colunas para destacar suas habilidades.",
    categoria: "Contemporâneo",
    premium: false
  },
  {
    id: "executivo",
    nome: "Executivo",
    descricao: "Design elegante e organizado para uma apresentação profissional.",
    categoria: "Profissional",
    premium: false
  },
  {
    id: "ats",
    nome: "ATS",
    descricao: "Estrutura objetiva e compatível com sistemas de recrutamento.",
    categoria: "Compatível com ATS",
    premium: true
  },
];

function Modelos() {
  const navigate = useNavigate();
  const { autenticado, carregando, usuario } = useAuth();
  const [modeloVisualizado, setModeloVisualizado] = useState(null);
  const [modalUpgradeAberto, setModalUpgradeAberto] = useState(false);

  const abrirVisualizacao = (modelo) => {
    setModeloVisualizado(modelo);
  };

  const fecharVisualizacao = () => {
    setModeloVisualizado(null);
  };

  const usarModelo = (modelo) => {
    const isPremiumBlocked = modelo.premium && (!autenticado || usuario?.plano === "Starter" || !usuario?.plano);
    
    if (isPremiumBlocked) {
      setModalUpgradeAberto(true);
      return;
    }

    localStorage.setItem("modeloSelecionado", modelo.id);
    if (autenticado) {
      navigate("/flow", {
        state: {
          modeloSelecionado: modelo.id,
        },
      });
      return;
    }
    navigate("/auth", {
      state: {
        modeloSelecionado: modelo.id,
      },
    });
  };

  return (
    <main className="modelos-page">
      <header className="modelos-header">
        <Link to="/" className="modelos-logo">
          <img src={logo} alt="Logo CVFlow" />
        </Link>
        <Link to="/" className="voltar-link">
          <ArrowLeft size={17} />
          Voltar
        </Link>
      </header>
      <section className="modelos-hero">
        <span className="modelos-badge">
          <FileText size={16} />
          Modelos de currículo
        </span>
        <h1>Encontre o modelo ideal para sua carreira</h1>
        <p>
          Escolha um modelo profissional e comece a criar um
          currículo que destaque suas experiências e habilidades.
        </p>
      </section>
      <section className="modelos-lista">
        {modelos.map((modelo) => {
          const isPremiumBlocked = modelo.premium && (!autenticado || usuario?.plano === "Starter" || !usuario?.plano);
          return (
            <article className={`modelo-card ${isPremiumBlocked ? 'bloqueado' : ''}`} key={modelo.id}>
              <div className="modelo-preview-container">
                <span className="modelo-categoria">
                  {modelo.categoria}
                </span>
                <div className="modelo-thumbnail-wrapper">
                  <PreviewCurriculo modelo={modelo.id} dados={dadosPreview} />
                </div>
                {isPremiumBlocked && (
                  <div className="modelo-premium-overlay">
                    <Star size={36} fill="#f59e0b" color="#f59e0b" />
                  </div>
                )}
              </div>
              <div className="modelo-informacoes">
                <h2>{modelo.nome}</h2>
                <p>{modelo.descricao}</p>
                <div className="modelo-acoes">
                  <button
                    type="button"
                    className="botao-visualizar"
                    onClick={() => abrirVisualizacao(modelo)}
                  >
                    <Eye size={17} />
                    Visualizar
                  </button>
                  <button
                    type="button"
                    className="botao-selecionar"
                    onClick={() => usarModelo(modelo)}
                    disabled={carregando}
                  >
                    {isPremiumBlocked ? 'Desbloquear' : 'Usar modelo'}
                    {!isPremiumBlocked && <ArrowRight size={17} />}
                    {isPremiumBlocked && <Star size={15} fill="#ffffff" color="#ffffff" style={{marginLeft: '6px'}} />}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <section className="modelos-beneficios">
        <div>
          <Check size={18} />
          Modelos profissionais
        </div>
        <div>
          <Check size={18} />
          Personalização fácil
        </div>
        <div>
          <Check size={18} />
          Exportação em PDF
        </div>
      </section>

      {modeloVisualizado && (
        <div className="modal-overlay" onClick={fecharVisualizacao}>
          <div className="modelo-modal" onClick={(evento) => evento.stopPropagation()}>
            <button
              type="button"
              className="modal-fechar"
              onClick={fecharVisualizacao}
              aria-label="Fechar visualização"
            >
              <X size={20} />
            </button>
            <div className="modal-cabecalho">
              <div>
                <span className="modal-categoria">
                  {modeloVisualizado.categoria}
                </span>
                <h2>{modeloVisualizado.nome}</h2>
              </div>
            </div>
            <div className="modal-preview">
              <div className="modal-thumbnail-wrapper">
                <PreviewCurriculo modelo={modeloVisualizado.id} dados={dadosPreview} />
              </div>
            </div>
            <div className="modal-informacoes">
              <p>{modeloVisualizado.descricao}</p>
              <button
                type="button"
                className="modal-usar-modelo"
                onClick={() => {
                  fecharVisualizacao();
                  usarModelo(modeloVisualizado);
                }}
                disabled={carregando}
              >
                Usar este modelo
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {modalUpgradeAberto && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalUpgradeAberto(false); }}>
          <div className="modelo-modal text-center" style={{ maxWidth: '420px', padding: '0' }} role="dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" style={{ top: '15px', right: '15px', border: 'none', background: 'transparent' }} onClick={() => setModalUpgradeAberto(false)}>
              <X size={20} />
            </button>
            
            <div style={{ padding: '40px' }}>
              <div style={{ width: '56px', height: '56px', color: "#d97706", backgroundColor: "#fef3c7", borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "0 auto 16px auto" }}>
                <Star size={28} fill="#d97706" />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '12px', color: '#1e293b' }}>Recurso Premium</h2>
              <p style={{ margin: "12px 0", lineHeight: "1.6", color: '#475569' }}>
                O modelo <strong>ATS</strong> é exclusivo para assinantes do plano Pro devido à sua otimização para sistemas de recrutamento.
              </p>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: '32px' }}>
                Faça o upgrade para desbloquear todos os templates, gerar currículos ilimitados e remover a marca d'água.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="modal-usar-modelo" 
                  style={{ width: "100%", justifyContent: 'center' }} 
                  onClick={() => navigate("/planos")} 
                >
                  Fazer Upgrade para Pro
                </button>
                <button 
                  style={{ width: "100%", padding: '12px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }} 
                  onClick={() => setModalUpgradeAberto(false)}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Modelos;