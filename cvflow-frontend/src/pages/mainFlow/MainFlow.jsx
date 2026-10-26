import {
  FileText,
  Plus,
  ChevronRight,
  Clock3,
  CheckCircle2,
  X,
  Check,
  ArrowRight,
  CopyPlus,
  Download,
  Eye,
  Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import { getToken } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import gerarPdf from "../../utils/gerarPdf";
import "./MainFlow.css";

const modelosDisponiveis = {
  ats: {
    nome: "ATS",
    descricao: "Modelo objetivo e compatível com sistemas de recrutamento.",
  },
  moderno: {
    nome: "Moderno",
    descricao: "Modelo visual com duas colunas para destacar suas habilidades.",
  },
  executivo: {
    nome: "Executivo",
    descricao: "Modelo elegante e organizado para apresentação profissional.",
  },
};

const MainFlow = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const previewPdfRef = useRef(null);
  
  const [curriculos, setCurriculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  
  const [modalAberto, setModalAberto] = useState(false);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [curriculosDoModelo, setCurriculosDoModelo] = useState([]);
  const [curriculoSelecionado, setCurriculoSelecionado] = useState(null);
  const [etapaModal, setEtapaModal] = useState("modelo");
  
  const [curriculoVisualizacao, setCurriculoVisualizacao] = useState(null);
  const [visualizacaoAberta, setVisualizacaoAberta] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [erroExportacao, setErroExportacao] = useState("");

  useEffect(() => {
    const buscarCurriculos = async () => {
      const token = getToken();
      if (!token) {
        setErro("Token não encontrado. Faça login novamente.");
        setCarregando(false);
        return;
      }
      try {
        const resposta = await fetch("http://localhost:5000/curriculos", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || "Erro ao carregar currículos.");
        setCurriculos(dados.curriculos || []);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };
    buscarCurriculos();
  }, []);

  const abrirModalCriacao = () => {
    setModeloSelecionado(null);
    setCurriculosDoModelo([]);
    setCurriculoSelecionado(null);
    setEtapaModal("modelo");
    setModalAberto(true);
  };

  const fecharModal = () => {
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

  const abrirVisualizacao = (curriculo) => {
    if (!curriculo) return;
    fecharModal();
    setErroExportacao("");
    setCurriculoVisualizacao(curriculo);
    setVisualizacaoAberta(true);
  };

  const fecharVisualizacao = () => {
    if (gerandoPdf) return;
    setVisualizacaoAberta(false);
    setTimeout(() => {
      setCurriculoVisualizacao(null);
      setErroExportacao("");
    }, 300);
  };

  const exportarCurriculo = async () => {
    if (!curriculoVisualizacao || gerandoPdf) return;
    try {
      setGerandoPdf(true);
      setErroExportacao("");
      await new Promise((res) => setTimeout(res, 700));
      if (!previewPdfRef.current) throw new Error("Área de exportação não encontrada.");
      
      const nomeArquivo = (curriculoVisualizacao.titulo || curriculoVisualizacao.dados?.nome || "curriculo")
        .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      await gerarPdf(previewPdfRef.current, `${nomeArquivo || "curriculo"}.pdf`);
    } catch (error) {
      setErroExportacao("Falha na geração do PDF. Tente novamente.");
    } finally {
      setGerandoPdf(false);
    }
  };

  const iniciarDoZero = () => {
    if (!modeloSelecionado) return;
    fecharModal();
    navigate("/flow/criar", {
      state: { modoEdicao: false, modeloSelecionado, reutilizarDados: false, dadosIniciais: null },
    });
  };

  const reutilizarDados = () => {
    if (!modeloSelecionado || !curriculoSelecionado) return;
    fecharModal();
    navigate("/flow/criar", {
      state: { modoEdicao: false, modeloSelecionado, reutilizarDados: true, dadosIniciais: curriculoSelecionado.dados || null },
    });
  };

  const nomeUsuario = usuario?.nome || "Profissional";
  const curriculosCompletos = curriculos.filter((c) => c.dados?.completo).length;
  const ultimoCurriculo = curriculos[0];

  const formatarData = (data) => {
    if (!data) return "Nenhuma atividade";
    return new Date(data).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <main className="mainflow-container">
      <Sidebar />
      <div className="mainflow-workspace">
        <header className="workspace-header animate-fade-in">
          <div className="header-greeting">
            <h1>Bem-vindo de volta, {nomeUsuario.split(' ')[0]}</h1>
            <p>Seu painel de controle e evolução de carreira.</p>
          </div>
          <div className="header-profile" onClick={() => navigate("/perfil")}>
            <div className="profile-initial">{nomeUsuario.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <span className="profile-name">Minha Conta</span>
              <span className="profile-plan">Plano Starter</span>
            </div>
            <ChevronRight size={18} className="profile-arrow" />
          </div>
        </header>

        <div className="bento-grid animate-slide-up">
          <div className="bento-box create-box">
            <div className="create-box-content">
              <div className="create-tag"><Rocket size={14} /> Destaque-se</div>
              <h2>Crie um documento<br/>que abre portas.</h2>
              <p>Escolha um modelo testado pelo mercado e deixe nosso sistema guiar o seu preenchimento.</p>
              <button className="btn-create-action" onClick={abrirModalCriacao}>
                <Plus size={18} /> Novo Currículo
              </button>
            </div>
            <div className="create-box-art">
              <div className="art-circle"></div>
              <FileText size={120} className="art-icon" />
            </div>
          </div>

          <div className="bento-box stats-box">
            <h3>Seu Desempenho</h3>
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-icon-wrapper bg-blue"><FileText size={18} /></div>
                <div className="stat-info">
                  <span className="stat-label">Criados</span>
                  <span className="stat-value">{curriculos.length}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper bg-green"><CheckCircle2 size={18} /></div>
                <div className="stat-info">
                  <span className="stat-label">Completos</span>
                  <span className="stat-value">{curriculosCompletos}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper bg-purple"><Clock3 size={18} /></div>
                <div className="stat-info">
                  <span className="stat-label">Última Edição</span>
                  <span className="stat-value small-val">{formatarData(ultimoCurriculo?.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="documents-section animate-slide-up-delayed">
          <div className="section-title-row">
            <h2>Arquivos Recentes</h2>
            <button className="btn-view-all" onClick={() => navigate("/curriculos")}>
              Ver galeria <ArrowRight size={16} />
            </button>
          </div>

          {carregando ? (
            <div className="workspace-empty">Carregando seus arquivos...</div>
          ) : erro ? (
            <div className="workspace-empty error">{erro}</div>
          ) : curriculos.length === 0 ? (
            <div className="workspace-empty">
              <div className="empty-circle"><FileText size={32} /></div>
              <h3>Sua mesa está limpa</h3>
              <p>Você ainda não possui documentos criados. Inicie um novo agora.</p>
              <button className="btn-outline" onClick={abrirModalCriacao}>Criar o primeiro</button>
            </div>
          ) : (
            <div className="documents-grid">
              {curriculos.slice(0, 4).map((curriculo) => (
                <div className="doc-card" key={curriculo.id} onClick={() => abrirVisualizacao(curriculo)}>
                  <div className="doc-preview">
                    
                    <div className="doc-thumbnail-container">
                      <div className="doc-thumbnail-wrapper">
                        <PreviewCurriculo modelo={curriculo.modelo} dados={curriculo.dados || {}} />
                      </div>
                    </div>

                    <div className="doc-hover-action">
                      <Eye size={20} /> Visualizar
                    </div>
                  </div>
                  <div className="doc-info">
                    <h4>{curriculo.titulo || "Meu Currículo"}</h4>
                    <p>{modelosDisponiveis[curriculo.modelo]?.nome || curriculo.modelo} • {formatarData(curriculo.updated_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {curriculoVisualizacao && (
        <div className="pdf-export-container" ref={previewPdfRef}>
          <PreviewCurriculo modelo={curriculoVisualizacao.modelo} dados={curriculoVisualizacao.dados || {}} />
        </div>
      )}

      {modalAberto && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharModal(); }}>
          <div className="modal-panel" role="dialog">
            <button className="btn-close-modal" onClick={fecharModal}><X size={20} /></button>
            
            {etapaModal === "modelo" && (
              <div className="modal-content">
                <div className="modal-icon-header"><Layers size={24} /></div>
                <h2>Escolha um Template</h2>
                <p>Selecione a estrutura visual que melhor representa seu perfil.</p>
                <div className="template-list">
                  {Object.entries(modelosDisponiveis).map(([chave, modelo]) => {
                    const emUso = curriculos.some((c) => c.modelo === chave);
                    return (
                      <div className="template-option" key={chave} onClick={() => selecionarModelo(chave)}>
                        <div className="template-thumb"><FileText size={24} /></div>
                        <div className="template-data">
                          <div className="template-title">
                            {modelo.nome} {emUso && <span className="tag-in-use">Em uso</span>}
                          </div>
                          <div className="template-desc">{modelo.descricao}</div>
                        </div>
                        <ChevronRight size={18} className="template-arrow" />
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
                    <div 
                      key={curriculo.id}
                      className={`clone-option ${curriculoSelecionado?.id === curriculo.id ? 'selected' : ''}`}
                      onClick={() => setCurriculoSelecionado(curriculo)}
                    >
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

      {visualizacaoAberta && curriculoVisualizacao && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharVisualizacao(); }}>
          <div className="preview-panel">
            <div className="preview-top">
              <div>
                <span className="preview-tag">Modo Visualização</span>
                <h2>{curriculoVisualizacao.titulo || "Documento"}</h2>
              </div>
              <button className="btn-close-modal" onClick={fecharVisualizacao} disabled={gerandoPdf}><X size={20} /></button>
            </div>
            <div className="preview-scroll-area">
              <div className="preview-document-wrapper">
                <PreviewCurriculo modelo={curriculoVisualizacao.modelo} dados={curriculoVisualizacao.dados || {}} />
              </div>
            </div>
            <div className="preview-bottom">
              <div className="preview-status">{erroExportacao}</div>
              <div className="preview-actions">
                <button className="btn-modal-outline" onClick={fecharVisualizacao} disabled={gerandoPdf}>Cancelar</button>
                <button className="btn-modal-solid" onClick={exportarCurriculo} disabled={gerandoPdf}>
                  <Download size={16} /> {gerandoPdf ? "Processando..." : "Baixar PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainFlow;