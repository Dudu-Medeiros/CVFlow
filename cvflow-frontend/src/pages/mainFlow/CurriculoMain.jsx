import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  Download,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  Check,
  Layers,
  CopyPlus,
  Lock,
  ArrowRight
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import gerarPdf from "../../utils/gerarPdf";
import { listarCurriculos, atualizarCurriculo, deletarCurriculo } from "../../services/curriculoService";
import { useAuth } from "../../hooks/useAuth";
import "./CurriculoMain.css";

const modelosDisponiveis = {
  minimalista: {
    nome: "Minimalista",
    descricao: "Modelo limpo, direto e em preto e branco. Ideal para iniciar.",
    premium: false
  },
  moderno: {
    nome: "Moderno",
    descricao: "Modelo visual com duas colunas para destacar suas habilidades.",
    premium: false
  },
  executivo: {
    nome: "Executivo",
    descricao: "Modelo elegante e organizado para apresentação profissional.",
    premium: false
  },
  ats: {
    nome: "ATS (Premium)",
    descricao: "Modelo otimizado para passar nos robôs de triagem das empresas.",
    premium: true 
  },
};

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

const CurriculoMain = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const previewPdfRef = useRef(null);
  
  const [curriculos, setCurriculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindoId, setExcluindoId] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [curriculoExportacao, setCurriculoExportacao] = useState(null);
  
  const [editandoTituloId, setEditandoTituloId] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [salvandoTituloId, setSalvandoTituloId] = useState(null);
  
  // Modal de Criação (Replicado do MainFlow)
  const [modalAberto, setModalAberto] = useState(false);
  const [modalUpgradeAberto, setModalUpgradeAberto] = useState(false); 
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [curriculosDoModelo, setCurriculosDoModelo] = useState([]);
  const [curriculoSelecionado, setCurriculoSelecionado] = useState(null);
  const [etapaModal, setEtapaModal] = useState("modelo");

  const [modal, setModal] = useState({
    aberto: false,
    tipo: "",
    curriculo: null,
    mensagem: "",
  });

  useEffect(() => {
    buscarCurriculos();
  }, []);

  async function buscarCurriculos() {
    try {
      setCarregando(true);
      setErro("");
      const resultado = await listarCurriculos();
      setCurriculos(resultado.curriculos || []);
    } catch (error) {
      setErro(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data) {
    if (!data) return "Data não disponível";
    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return "Data não disponível";
    return dataFormatada.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function iniciarEdicaoTitulo(curriculo) {
    setEditandoTituloId(curriculo.id);
    setNovoTitulo(curriculo.titulo || "Meu currículo");
  }

  function cancelarEdicaoTitulo() {
    setEditandoTituloId(null);
    setNovoTitulo("");
  }

  async function salvarTitulo(curriculo) {
    const titulo = novoTitulo.trim();
    if (!titulo) return;
    try {
      setSalvandoTituloId(curriculo.id);
      const resultado = await atualizarCurriculo(curriculo.id, { titulo });
      setCurriculos((curriculosAtuais) =>
        curriculosAtuais.map((item) =>
          item.id === curriculo.id ? { ...item, titulo: resultado.curriculo?.titulo || titulo } : item
        )
      );
      cancelarEdicaoTitulo();
    } catch (error) {
      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem: error.message || "Não foi possível renomear o currículo.",
      });
    } finally {
      setSalvandoTituloId(null);
    }
  }

  function lidarTeclaTitulo(event, curriculo) {
    if (event.key === "Enter") {
      event.preventDefault();
      salvarTitulo(curriculo);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelarEdicaoTitulo();
    }
  }

  async function executarDownload(curriculo) {
    if (!curriculo || gerandoPdf) return;
    try {
      setGerandoPdf(true);
      setCurriculoExportacao(curriculo);
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!previewPdfRef.current) throw new Error("Área de exportação não encontrada.");
      
      const nomeArquivo = (curriculo.titulo || curriculo.dados?.nome || "curriculo")
        .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      await gerarPdf(
        previewPdfRef.current, 
        `${nomeArquivo || "curriculo"}.pdf`,
        usuario?.plano || "Starter"
      );
    } catch (error) {
      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem: "Não foi possível gerar o PDF. Tente novamente.",
      });
    } finally {
      setGerandoPdf(false);
      setCurriculoExportacao(null);
    }
  }

  function abrirModalExclusao(curriculo) {
    setModal({
      aberto: true,
      tipo: "exclusao",
      curriculo,
      mensagem: "",
    });
  }

  function fecharModalGenerico() {
    if (excluindoId !== null) return;
    setModal({ aberto: false, tipo: "", curriculo: null, mensagem: "" });
  }

  function editarCurriculo(curriculo) {
    navigate("/flow/criar", {
      state: { modoEdicao: true, curriculo },
    });
  }

  async function confirmarExclusao() {
    const curriculo = modal.curriculo;
    if (!curriculo) return;
    try {
      setExcluindoId(curriculo.id);
      await deletarCurriculo(curriculo.id);
      setCurriculos((curriculosAtuais) =>
        curriculosAtuais.filter((item) => item.id !== curriculo.id)
      );
      setModal({
        aberto: true,
        tipo: "sucesso",
        curriculo: null,
        mensagem: "Currículo excluído com sucesso!",
      });
    } catch (error) {
      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem: error.message || "Não foi possível excluir o currículo.",
      });
    } finally {
      setExcluindoId(null);
    }
  }

  const curriculosFiltrados = curriculos.filter((curriculo) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    const titulo = (curriculo.titulo || "").toLowerCase();
    const cargo = (curriculo.dados?.cargo || "").toLowerCase();
    const modelo = (curriculo.modelo || "").toLowerCase();
    return titulo.includes(termo) || cargo.includes(termo) || modelo.includes(termo);
  });

  // Funções do Modal de Criação
  const abrirModalCriacao = () => {
    const planoAtual = usuario?.plano || "Starter";
    if (planoAtual === "Starter" && curriculos.length >= 1) {
      setModalUpgradeAberto(true);
      return;
    }
    setModeloSelecionado(null);
    setCurriculosDoModelo([]);
    setCurriculoSelecionado(null);
    setEtapaModal("modelo");
    setModalAberto(true);
  };

  const fecharModalCriacao = () => {
    setModalAberto(false);
    setTimeout(() => {
      setModeloSelecionado(null);
      setCurriculosDoModelo([]);
      setCurriculoSelecionado(null);
      setEtapaModal("modelo");
    }, 300);
  };

  const selecionarModelo = (modelo) => {
    setModeloSelecionado(modelo);
    setCurriculoSelecionado(null);
    const existentes = curriculos.filter((c) => c.modelo === modelo);
    setCurriculosDoModelo(existentes);
    if (existentes.length > 0) {
      setEtapaModal("existente");
    } else {
      setEtapaModal("confirmar");
    }
  };

  const iniciarDoZero = () => {
    if (!modeloSelecionado) return;
    fecharModalCriacao();
    navigate("/flow/criar", {
      state: { modoEdicao: false, modeloSelecionado, reutilizarDados: false, dadosIniciais: null },
    });
  };

  const reutilizarDados = () => {
    if (!modeloSelecionado || !curriculoSelecionado) return;
    fecharModalCriacao();
    navigate("/flow/criar", {
      state: { modoEdicao: false, modeloSelecionado, reutilizarDados: true, dadosIniciais: curriculoSelecionado.dados || null },
    });
  };

  return (
    <main className="curriculos-layout">
      <Sidebar />
      <section className="curriculos-workspace animate-fade-in">
        <header className="curriculos-header">
          <div className="header-titles">
            <h1>Galeria de Currículos</h1>
            <p>Gerencie, edite e exporte seus documentos profissionais.</p>
          </div>
          <button className="btn-primary" onClick={abrirModalCriacao}>
            <Plus size={18} /> Novo Currículo
          </button>
        </header>
        <section className="curriculos-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por título, cargo ou modelo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <span className="curriculos-count">
            {curriculosFiltrados.length} {curriculosFiltrados.length === 1 ? "documento" : "documentos"}
          </span>
        </section>
        <section className="curriculos-content">
          {carregando && (
            <div className="workspace-empty">
              <h2>Carregando sua galeria...</h2>
            </div>
          )}
          {!carregando && erro && (
            <div className="workspace-empty error-state">
              <div className="empty-circle"><AlertTriangle size={30} /></div>
              <h2>Ocorreu um erro</h2>
              <p>{erro}</p>
              <button className="btn-outline" onClick={buscarCurriculos}>
                Tentar novamente
              </button>
            </div>
          )}
          {!carregando && !erro && curriculos.length > 0 && curriculosFiltrados.length === 0 && (
            <div className="workspace-empty">
              <div className="empty-circle"><Search size={30} /></div>
              <h2>Nenhum resultado encontrado</h2>
              <p>Não encontramos documentos para "{busca}".</p>
            </div>
          )}
          {!carregando && !erro && curriculos.length === 0 && (
            <div className="workspace-empty">
              <div className="empty-circle"><FileText size={30} /></div>
              <h2>Sua galeria está vazia</h2>
              <p>Você ainda não possui currículos. Inicie um novo agora e acelere sua carreira.</p>
              <button className="btn-primary" onClick={abrirModalCriacao}>
                <Plus size={18} /> Criar o primeiro
              </button>
            </div>
          )}
          {!carregando && !erro && curriculosFiltrados.length > 0 && (
            <div className="documents-grid animate-slide-up">
              {curriculosFiltrados.map((curriculo) => {
                const editandoTitulo = editandoTituloId === curriculo.id;
                const salvandoTitulo = salvandoTituloId === curriculo.id;
                return (
                  <div className="doc-card" key={curriculo.id}>
                    <div className="doc-preview" onClick={() => editarCurriculo(curriculo)}>
                      <div className="doc-thumbnail-container">
                        <div className="doc-thumbnail-wrapper">
                          <PreviewCurriculo modelo={curriculo.modelo} dados={curriculo.dados || {}} />
                        </div>
                      </div>
                      <div className="doc-hover-overlay">
                        <button 
                          className="hover-action-btn" 
                          title="Editar"
                          onClick={(e) => { e.stopPropagation(); editarCurriculo(curriculo); }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className="hover-action-btn primary" 
                          title="Baixar PDF"
                          disabled={gerandoPdf}
                          onClick={(e) => { e.stopPropagation(); executarDownload(curriculo); }}
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          className="hover-action-btn danger" 
                          title="Excluir"
                          onClick={(e) => { e.stopPropagation(); abrirModalExclusao(curriculo); }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="doc-info">
                      {editandoTitulo ? (
                        <div className="title-edit-box">
                          <input
                            className="title-input"
                            type="text"
                            value={novoTitulo}
                            maxLength={100}
                            autoFocus
                            disabled={salvandoTitulo}
                            onChange={(e) => setNovoTitulo(e.target.value)}
                            onKeyDown={(e) => lidarTeclaTitulo(e, curriculo)}
                          />
                          <button
                            className="btn-confirm-edit"
                            type="button"
                            disabled={salvandoTitulo || !novoTitulo.trim()}
                            onClick={() => salvarTitulo(curriculo)}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="btn-cancel-edit"
                            type="button"
                            disabled={salvandoTitulo}
                            onClick={cancelarEdicaoTitulo}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="doc-title-clickable" 
                          onClick={() => iniciarEdicaoTitulo(curriculo)}
                          title="Clique para renomear"
                        >
                          <h4>{curriculo.titulo || "Meu Currículo"}</h4>
                          <Pencil size={14} className="edit-hint-icon" />
                        </div>
                      )}
                      <p>{modelosDisponiveis[curriculo.modelo]?.nome || curriculo.modelo} • Atualizado em {formatarData(curriculo.updated_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {curriculoExportacao && (
        <div className="pdf-export-container" ref={previewPdfRef}>
          <PreviewCurriculo
            modelo={curriculoExportacao.modelo}
            dados={curriculoExportacao.dados || {}}
          />
        </div>
      )}

      {/* Modais de Criação do MainFlow Replicados */}
      {modalUpgradeAberto && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalUpgradeAberto(false); }}>
          <div className="modal-panel" role="dialog" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <button className="btn-close-modal" onClick={() => setModalUpgradeAberto(false)}><X size={20} /></button>
            <div className="modal-content">
              <div className="modal-icon-header" style={{ color: "#d97706", backgroundColor: "#fef3c7", margin: "0 auto 16px auto" }}>
                <Lock size={28} />
              </div>
              <h2>Limite do Plano Starter</h2>
              <p style={{ margin: "12px 0", lineHeight: "1.6" }}>
                O seu plano gratuito permite manter <strong>apenas 1 currículo ativo</strong> simultaneamente.
              </p>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Faça o upgrade para o plano Pro e desbloqueie currículos ilimitados, remoção de marca d'água e acesso a todos os templates premium.
              </p>
              <div className="modal-actions-row" style={{ justifyContent: "center", marginTop: "24px", flexDirection: "column", gap: "12px" }}>
                <button className="btn-modal-solid" style={{ width: "100%", backgroundColor: "#6366f1", color: "white" }} onClick={() => navigate("/planos")}>
                  Fazer Upgrade para Pro
                </button>
                <button className="btn-modal-outline" style={{ width: "100%" }} onClick={() => setModalUpgradeAberto(false)}>
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharModalCriacao(); }}>
          <div className="modal-panel" role="dialog">
            <button className="btn-close-modal" onClick={fecharModalCriacao}><X size={20} /></button>
            
            {etapaModal === "modelo" && (
              <div className="modal-content modal-content-large">
                <div className="modal-icon-header"><Layers size={24} /></div>
                <h2>Escolha um Template</h2>
                <p>Selecione a estrutura visual que melhor representa seu perfil.</p>
                
                <div className="template-grid">
                  {Object.entries(modelosDisponiveis).map(([chave, modelo]) => {
                    const emUso = curriculos.some((c) => c.modelo === chave);
                    const bloqueadoPremium = modelo.premium && (usuario?.plano === "Starter" || !usuario?.plano);
                    
                    return (
                      <div 
                        className={`template-card ${bloqueadoPremium ? 'bloqueado' : ''}`} 
                        key={chave} 
                        onClick={() => {
                          if (bloqueadoPremium) {
                            setModalUpgradeAberto(true);
                          } else {
                            selecionarModelo(chave);
                          }
                        }}
                      >
                        <div className="template-card-preview">
                          <div className="template-thumbnail-wrapper">
                            <PreviewCurriculo modelo={chave} dados={dadosPreview} />
                          </div>
                          {bloqueadoPremium && (
                            <div className="template-premium-overlay">
                              <Lock size={24} />
                              <span>PRO</span>
                            </div>
                          )}
                        </div>
                        <div className="template-card-info">
                          <div className="template-card-header">
                            <span className="template-card-title">{modelo.nome}</span>
                            {emUso && <span className="tag-in-use">Em uso</span>}
                          </div>
                          <p className="template-card-desc">{modelo.descricao}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {etapaModal === "confirmar" && modeloSelecionado && (
              <div className="modal-content">
                <div className="modal-icon-header"><Check size={24} /></div>
                <h2>Template Confirmado</h2>
                <p>Você escolheu criar um documento com o design <strong>{modelosDisponiveis[modeloSelecionado].nome}</strong>.</p>
                <div className="modal-actions-row">
                  <button className="btn-modal-outline" onClick={() => setEtapaModal("modelo")}>Alterar</button>
                  <button className="btn-modal-solid" onClick={iniciarDoZero}>Preencher Dados <ArrowRight size={16}/></button>
                </div>
              </div>
            )}

            {etapaModal === "existente" && modeloSelecionado && (
              <div className="modal-content">
                <div className="modal-icon-header"><CopyPlus size={24} /></div>
                <h2>Dados Existentes Encontrados</h2>
                <p>Você tem <strong>{curriculosDoModelo.length}</strong> currículo(s) com este template. Deseja clonar os dados de um deles ou começar vazio?</p>
                <div className="clone-list">
                  {curriculosDoModelo.map((curriculo) => (
                    <div key={curriculo.id} className={`clone-option ${curriculoSelecionado?.id === curriculo.id ? 'selected' : ''}`} onClick={() => setCurriculoSelecionado(curriculo)}>
                      <div className="clone-info">
                        <strong>{curriculo.titulo || "Meu Currículo"}</strong>
                        <span>{formatarData(curriculo.updated_at)}</span>
                      </div>
                      <div className="clone-radio">
                        {curriculoSelecionado?.id === curriculo.id && <div className="radio-dot"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-actions-row">
                  <button className="btn-modal-outline" onClick={iniciarDoZero}>Iniciar Vazio</button>
                  <button className="btn-modal-solid" onClick={reutilizarDados} disabled={!curriculoSelecionado}>
                    Clonar Selecionado <ArrowRight size={16}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Genérico (Sucesso, Erro, Exclusão) */}
      {modal.aberto && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharModalGenerico(); }}>
          <div className="modal-panel zoom-in" role="dialog" aria-modal="true">
            <button className="btn-close-modal" onClick={fecharModalGenerico} disabled={excluindoId !== null}>
              <X size={20} />
            </button>
            {modal.tipo === "exclusao" && (
              <div className="modal-content text-center">
                <div className="modal-icon-header danger-icon"><AlertTriangle size={28} /></div>
                <h2>Excluir Documento?</h2>
                <p>
                  Você está prestes a excluir <strong>"{modal.curriculo?.titulo || "Meu Currículo"}"</strong>. Esta ação é permanente e não poderá ser desfeita.
                </p>
                <div className="modal-actions-row">
                  <button className="btn-modal-outline" onClick={fecharModalGenerico} disabled={excluindoId !== null}>
                    Cancelar
                  </button>
                  <button className="btn-modal-solid danger-btn" onClick={confirmarExclusao} disabled={excluindoId !== null}>
                    {excluindoId !== null ? "Excluindo..." : "Sim, excluir"}
                  </button>
                </div>
              </div>
            )}
            {modal.tipo === "sucesso" && (
              <div className="modal-content text-center">
                <div className="modal-icon-header success-icon"><CheckCircle size={28} /></div>
                <h2>Concluído</h2>
                <p>{modal.mensagem}</p>
                <div className="modal-actions-row">
                  <button className="btn-modal-solid" onClick={fecharModalGenerico}>Continuar</button>
                </div>
              </div>
            )}
            {modal.tipo === "erro" && (
              <div className="modal-content text-center">
                <div className="modal-icon-header danger-icon"><AlertTriangle size={28} /></div>
                <h2>Atenção</h2>
                <p>{modal.mensagem}</p>
                <div className="modal-actions-row">
                  <button className="btn-modal-solid" onClick={fecharModalGenerico}>Entendido</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CurriculoMain;