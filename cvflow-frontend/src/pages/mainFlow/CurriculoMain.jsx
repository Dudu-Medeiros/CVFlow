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
  LayoutTemplate
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import gerarPdf from "../../utils/gerarPdf";
import { listarCurriculos, atualizarCurriculo, deletarCurriculo } from "../../services/curriculoService";
import "./CurriculoMain.css";

const modelosDisponiveis = {
  ats: { nome: "ATS" },
  moderno: { nome: "Moderno" },
  executivo: { nome: "Executivo" },
};

const CurriculoMain = () => {
  const navigate = useNavigate();
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
      await gerarPdf(previewPdfRef.current, `${nomeArquivo || "curriculo"}.pdf`);
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

  function fecharModal() {
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

  return (
    <main className="curriculos-layout">
      <Sidebar />
      <section className="curriculos-workspace animate-fade-in">
        <header className="curriculos-header">
          <div className="header-titles">
            <h1>Galeria de Currículos</h1>
            <p>Gerencie, edite e exporte seus documentos profissionais.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/flow/criar")}>
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
              <button className="btn-primary" onClick={() => navigate("/flow/criar")}>
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

      {modal.aberto && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharModal(); }}>
          <div className="modal-panel zoom-in" role="dialog" aria-modal="true">
            <button className="btn-close-modal" onClick={fecharModal} disabled={excluindoId !== null}>
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
                  <button className="btn-modal-outline" onClick={fecharModal} disabled={excluindoId !== null}>
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
                  <button className="btn-modal-solid" onClick={fecharModal}>Continuar</button>
                </div>
              </div>
            )}

            {modal.tipo === "erro" && (
              <div className="modal-content text-center">
                <div className="modal-icon-header danger-icon"><AlertTriangle size={28} /></div>
                <h2>Atenção</h2>
                <p>{modal.mensagem}</p>
                <div className="modal-actions-row">
                  <button className="btn-modal-solid" onClick={fecharModal}>Entendido</button>
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