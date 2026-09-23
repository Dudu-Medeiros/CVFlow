import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Clock3,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  Check,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import { getToken } from "../../utils/auth";
import gerarPdf from "../../utils/gerarPdf";
import "./CurriculoMain.css";

const CurriculoMain = () => {
  const navigate = useNavigate();
  const previewPdfRef = useRef(null);

  const [curriculos, setCurriculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindoId, setExcluindoId] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [curriculoExportacao, setCurriculoExportacao] =
    useState(null);

  const [editandoTituloId, setEditandoTituloId] =
    useState(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [salvandoTituloId, setSalvandoTituloId] =
    useState(null);

  const [modal, setModal] = useState({
    aberto: false,
    tipo: "",
    curriculo: null,
    mensagem: "",
  });

  useEffect(() => {
    buscarCurriculos();
  }, [navigate]);

  async function buscarCurriculos() {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        "http://localhost:5000/curriculos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível carregar os currículos."
        );
      }

      setCurriculos(resultado.curriculos || []);
    } catch (error) {
      console.error("Erro ao buscar currículos:", error);

      setErro(
        error.message ||
          "Erro ao conectar com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data) {
    if (!data) {
      return "Data não disponível";
    }

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return "Data não disponível";
    }

    return `Atualizado em ${dataFormatada.toLocaleDateString(
      "pt-BR"
    )}`;
  }

  function obterCargo(curriculo) {
    return (
      curriculo.dados?.cargo ||
      "Cargo não informado"
    );
  }

  function obterStatus(curriculo) {
    const dados = curriculo.dados || {};

    const possuiNome = Boolean(dados.nome?.trim());
    const possuiEmail = Boolean(dados.email?.trim());

    if (possuiNome && possuiEmail) {
      return "Completo";
    }

    return "Incompleto";
  }

  function iniciarEdicaoTitulo(curriculo) {
    setEditandoTituloId(curriculo.id);
    setNovoTitulo(
      curriculo.titulo || "Meu currículo"
    );
  }

  function cancelarEdicaoTitulo() {
    setEditandoTituloId(null);
    setNovoTitulo("");
  }

  async function salvarTitulo(curriculo) {
    const titulo = novoTitulo.trim();

    if (!titulo) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSalvandoTituloId(curriculo.id);

      const resposta = await fetch(
        `http://localhost:5000/curriculos/${curriculo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
          }),
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível renomear o currículo."
        );
      }

      setCurriculos((curriculosAtuais) =>
        curriculosAtuais.map((item) =>
          item.id === curriculo.id
            ? {
                ...item,
                titulo:
                  resultado.curriculo?.titulo ||
                  titulo,
              }
            : item
        )
      );

      cancelarEdicaoTitulo();
    } catch (error) {
      console.error(
        "Erro ao renomear currículo:",
        error
      );

      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem:
          error.message ||
          "Não foi possível renomear o currículo.",
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

  async function abrirModalDownload(curriculo) {
    if (!curriculo || gerandoPdf) {
      return;
    }

    try {
      setGerandoPdf(true);
      setCurriculoExportacao(curriculo);

      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });

      if (!previewPdfRef.current) {
        throw new Error(
          "Área de exportação não encontrada."
        );
      }

      const nomeArquivo = (
        curriculo.titulo || "curriculo"
      )
        .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      await gerarPdf(
        previewPdfRef.current,
        `${nomeArquivo || "curriculo"}.pdf`
      );
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);

      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem:
          "Não foi possível gerar o PDF. Tente novamente.",
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
    if (excluindoId !== null) {
      return;
    }

    setModal({
      aberto: false,
      tipo: "",
      curriculo: null,
      mensagem: "",
    });
  }

  function editarCurriculo(curriculo) {
    navigate("/flow/criar", {
      state: {
        modoEdicao: true,
        curriculo,
      },
    });
  }

  async function confirmarExclusao() {
    const curriculo = modal.curriculo;

    if (!curriculo) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setExcluindoId(curriculo.id);

      const resposta = await fetch(
        `http://localhost:5000/curriculos/${curriculo.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível excluir o currículo."
        );
      }

      setCurriculos((curriculosAtuais) =>
        curriculosAtuais.filter(
          (item) => item.id !== curriculo.id
        )
      );

      setModal({
        aberto: true,
        tipo: "sucesso",
        curriculo: null,
        mensagem: "Currículo excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir currículo:", error);

      setModal({
        aberto: true,
        tipo: "erro",
        curriculo: null,
        mensagem:
          error.message ||
          "Não foi possível excluir o currículo.",
      });
    } finally {
      setExcluindoId(null);
    }
  }

  const curriculosFiltrados = curriculos.filter(
    (curriculo) => {
      const termo = busca.toLowerCase().trim();

      if (!termo) {
        return true;
      }

      const titulo = (
        curriculo.titulo || ""
      ).toLowerCase();

      const cargo = (
        curriculo.dados?.cargo || ""
      ).toLowerCase();

      const modelo = (
        curriculo.modelo || ""
      ).toLowerCase();

      return (
        titulo.includes(termo) ||
        cargo.includes(termo) ||
        modelo.includes(termo)
      );
    }
  );

  return (
    <main className="curriculos-layout">
      <Sidebar />

      <section className="curriculos-page">
        <header className="curriculos-header">
          <div>
            <span className="curriculos-badge">
              <FileText size={14} />
              Meus documentos
            </span>

            <h1>Meus currículos</h1>

            <p>
              Gerencie seus currículos e mantenha suas
              informações profissionais sempre atualizadas.
            </p>
          </div>

          <button
            className="novo-curriculo-button"
            onClick={() => navigate("/flow/criar")}
          >
            <Plus size={19} />
            Novo currículo
          </button>
        </header>

        <section className="curriculos-toolbar">
          <div className="curriculos-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar currículo..."
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
            />
          </div>

          <span className="curriculos-count">
            {curriculosFiltrados.length} currículos
          </span>
        </section>

        <section className="curriculos-list">
          {carregando && (
            <div className="curriculos-empty">
              <h2>Carregando currículos...</h2>

              <p>
                Aguarde enquanto buscamos seus documentos.
              </p>
            </div>
          )}

          {!carregando && erro && (
            <div className="curriculos-empty">
              <div className="empty-icon">
                <FileText size={30} />
              </div>

              <h2>Não foi possível carregar</h2>

              <p>{erro}</p>

              <button
                className="novo-curriculo-button"
                onClick={buscarCurriculos}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando &&
            !erro &&
            curriculosFiltrados.map((curriculo) => {
              const editandoTitulo =
                editandoTituloId === curriculo.id;

              const salvandoTitulo =
                salvandoTituloId === curriculo.id;

              return (
                <article
                  className="curriculo-card"
                  key={curriculo.id}
                >
                  <div className="curriculo-icon">
                    <FileText size={25} />
                  </div>

                  <div className="curriculo-info">
                    {editandoTitulo ? (
                      <div className="curriculo-titulo-edicao">
                        <input
                          className="curriculo-titulo-input"
                          type="text"
                          value={novoTitulo}
                          maxLength={150}
                          autoFocus
                          disabled={salvandoTitulo}
                          onChange={(event) =>
                            setNovoTitulo(
                              event.target.value
                            )
                          }
                          onKeyDown={(event) =>
                            lidarTeclaTitulo(
                              event,
                              curriculo
                            )
                          }
                        />

                        <button
                          className="curriculo-titulo-confirmar"
                          type="button"
                          title="Salvar título"
                          disabled={
                            salvandoTitulo ||
                            !novoTitulo.trim()
                          }
                          onClick={() =>
                            salvarTitulo(curriculo)
                          }
                        >
                          <Check size={16} />
                        </button>

                        <button
                          className="curriculo-titulo-cancelar"
                          type="button"
                          title="Cancelar"
                          disabled={salvandoTitulo}
                          onClick={
                            cancelarEdicaoTitulo
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="curriculo-titulo"
                        type="button"
                        title="Clique para renomear"
                        onClick={() =>
                          iniciarEdicaoTitulo(curriculo)
                        }
                      >
                        <span>
                          {curriculo.titulo ||
                            "Meu currículo"}
                        </span>

                        <Pencil size={14} />
                      </button>
                    )}

                    <p className="curriculo-cargo">
                      {obterCargo(curriculo)}
                    </p>

                    <div className="curriculo-meta">
                      <span>
                        <Clock3 size={14} />
                        {formatarData(
                          curriculo.updated_at
                        )}
                      </span>

                      <span className="curriculo-status">
                        {obterStatus(curriculo)}
                      </span>
                    </div>
                  </div>

                  <div className="curriculo-actions">
                    <button
                      className="curriculo-action"
                      title="Editar currículo"
                      onClick={() =>
                        editarCurriculo(curriculo)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="curriculo-action"
                      title={
                        gerandoPdf
                          ? "Gerando PDF..."
                          : "Baixar currículo"
                      }
                      disabled={gerandoPdf}
                      onClick={() =>
                        abrirModalDownload(curriculo)
                      }
                    >
                      <Download size={17} />
                    </button>

                    <button
                      className="curriculo-action danger"
                      title="Excluir currículo"
                      disabled={
                        excluindoId === curriculo.id
                      }
                      onClick={() =>
                        abrirModalExclusao(curriculo)
                      }
                    >
                      <Trash2 size={17} />
                    </button>

                    <button
                      className="curriculo-more"
                      title="Mais opções"
                      onClick={() =>
                        editarCurriculo(curriculo)
                      }
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </div>
                </article>
              );
            })}

          {!carregando &&
            !erro &&
            curriculos.length > 0 &&
            curriculosFiltrados.length === 0 && (
              <div className="curriculos-empty">
                <div className="empty-icon">
                  <Search size={30} />
                </div>

                <h2>Nenhum currículo encontrado</h2>

                <p>
                  Tente buscar usando outro título ou cargo.
                </p>
              </div>
            )}

          {!carregando &&
            !erro &&
            curriculos.length === 0 && (
              <div className="curriculos-empty">
                <div className="empty-icon">
                  <FileText size={30} />
                </div>

                <h2>Você ainda não possui currículos</h2>

                <p>
                  Crie seu primeiro currículo e comece a
                  construir novas oportunidades profissionais.
                </p>

                <button
                  className="novo-curriculo-button"
                  onClick={() =>
                    navigate("/flow/criar")
                  }
                >
                  <Plus size={18} />
                  Criar meu primeiro currículo
                </button>
              </div>
            )}
        </section>
      </section>

      {curriculoExportacao && (
        <div
          className="pdf-export-container"
          ref={previewPdfRef}
        >
          <PreviewCurriculo
            modelo={curriculoExportacao.modelo}
            dados={curriculoExportacao.dados || {}}
          />
        </div>
      )}

      {modal.aberto && (
        <div
          className="modal-overlay"
          onClick={fecharModal}
        >
          <div
            className="modal-container"
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={fecharModal}
              disabled={excluindoId !== null}
              title="Fechar"
            >
              <X size={19} />
            </button>

            {modal.tipo === "exclusao" && (
              <>
                <div className="modal-icon modal-icon-danger">
                  <AlertTriangle size={28} />
                </div>

                <h2>Excluir currículo?</h2>

                <p>
                  Tem certeza de que deseja excluir{" "}
                  <strong>
                    "{modal.curriculo?.titulo}"
                  </strong>
                  ? Essa ação não poderá ser desfeita.
                </p>

                <div className="modal-actions">
                  <button
                    className="modal-button modal-button-secondary"
                    onClick={fecharModal}
                    disabled={excluindoId !== null}
                  >
                    Cancelar
                  </button>

                  <button
                    className="modal-button modal-button-danger"
                    onClick={confirmarExclusao}
                    disabled={excluindoId !== null}
                  >
                    {excluindoId !== null
                      ? "Excluindo..."
                      : "Excluir currículo"}
                  </button>
                </div>
              </>
            )}

            {modal.tipo === "sucesso" && (
              <>
                <div className="modal-icon modal-icon-success">
                  <CheckCircle size={28} />
                </div>

                <h2>Operação concluída</h2>

                <p>{modal.mensagem}</p>

                <div className="modal-actions">
                  <button
                    className="modal-button modal-button-primary"
                    onClick={fecharModal}
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {modal.tipo === "erro" && (
              <>
                <div className="modal-icon modal-icon-danger">
                  <AlertTriangle size={28} />
                </div>

                <h2>Ocorreu um erro</h2>

                <p>{modal.mensagem}</p>

                <div className="modal-actions">
                  <button
                    className="modal-button modal-button-primary"
                    onClick={fecharModal}
                  >
                    Fechar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CurriculoMain;