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
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import PreviewCurriculo from "../../components/CriarCurriculo/PreviewCurriculo";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/auth";
import gerarPdf from "../../utils/gerarPdf";
import "./MainFlow.css";

const modelosDisponiveis = {
  ats: {
    nome: "ATS",
    descricao:
      "Modelo objetivo e compatível com sistemas de recrutamento.",
  },

  moderno: {
    nome: "Moderno",
    descricao:
      "Modelo visual com duas colunas para destacar suas habilidades.",
  },

  executivo: {
    nome: "Executivo",
    descricao:
      "Modelo elegante e organizado para uma apresentação profissional.",
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
  const [modeloSelecionado, setModeloSelecionado] =
    useState(null);

  const [curriculosDoModelo, setCurriculosDoModelo] =
    useState([]);

  const [curriculoSelecionado, setCurriculoSelecionado] =
    useState(null);

  const [etapaModal, setEtapaModal] =
    useState("modelo");

  const [curriculoVisualizacao, setCurriculoVisualizacao] =
    useState(null);

  const [visualizacaoAberta, setVisualizacaoAberta] =
    useState(false);

  const [gerandoPdf, setGerandoPdf] =
    useState(false);

  const [erroExportacao, setErroExportacao] =
    useState("");

  useEffect(() => {
    const buscarCurriculos = async () => {
      const token = getToken();

      if (!token) {
        setErro(
          "Token de autenticação não encontrado."
        );
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          "http://localhost:5000/curriculos",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.erro ||
              "Não foi possível carregar os currículos."
          );
        }

        setCurriculos(dados.curriculos || []);
      } catch (error) {
        console.error(
          "[CURRICULOS ERROR]",
          error
        );

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
    setModeloSelecionado(null);
    setCurriculosDoModelo([]);
    setCurriculoSelecionado(null);
    setEtapaModal("modelo");
  };

  const selecionarModelo = (modelo) => {
    setModeloSelecionado(modelo);
    setCurriculoSelecionado(null);

    const existentes = curriculos.filter(
      (curriculo) =>
        curriculo.modelo === modelo
    );

    setCurriculosDoModelo(existentes);

    if (existentes.length > 0) {
      setEtapaModal("existente");
      return;
    }

    setEtapaModal("confirmar");
  };

  const abrirVisualizacao = (curriculo) => {
    if (!curriculo) {
      return;
    }

    fecharModal();

    setErroExportacao("");
    setCurriculoVisualizacao(curriculo);
    setVisualizacaoAberta(true);
  };

  const fecharVisualizacao = () => {
    if (gerandoPdf) {
      return;
    }

    setVisualizacaoAberta(false);
    setCurriculoVisualizacao(null);
    setErroExportacao("");
  };

  const exportarCurriculo = async () => {
    if (
      !curriculoVisualizacao ||
      gerandoPdf
    ) {
      return;
    }

    try {
      setGerandoPdf(true);
      setErroExportacao("");

      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });

      if (!previewPdfRef.current) {
        throw new Error(
          "Área de exportação não encontrada."
        );
      }

      const nomeArquivo = (
        curriculoVisualizacao.titulo ||
        curriculoVisualizacao.dados?.nome ||
        "curriculo"
      )
        .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      await gerarPdf(
        previewPdfRef.current,
        `${nomeArquivo || "curriculo"}.pdf`
      );
    } catch (error) {
      console.error(
        "Erro ao gerar PDF:",
        error
      );

      setErroExportacao(
        "Não foi possível gerar o PDF. Tente novamente."
      );
    } finally {
      setGerandoPdf(false);
    }
  };

  const escolherCriarNovo = () => {
    setCurriculoSelecionado(null);
    setEtapaModal("dados");
  };

  const selecionarCurriculoParaReutilizar = (
    curriculo
  ) => {
    setCurriculoSelecionado(curriculo);
  };

  const iniciarDoZero = () => {
    if (!modeloSelecionado) {
      return;
    }

    fecharModal();

    navigate("/flow/criar", {
      state: {
        modoEdicao: false,
        modeloSelecionado,
        reutilizarDados: false,
        dadosIniciais: null,
      },
    });
  };

  const reutilizarDados = () => {
    if (
      !modeloSelecionado ||
      !curriculoSelecionado
    ) {
      return;
    }

    fecharModal();

    navigate("/flow/criar", {
      state: {
        modoEdicao: false,
        modeloSelecionado,
        reutilizarDados: true,
        dadosIniciais:
          curriculoSelecionado.dados || null,
      },
    });
  };

  const voltarParaModelos = () => {
    setModeloSelecionado(null);
    setCurriculosDoModelo([]);
    setCurriculoSelecionado(null);
    setEtapaModal("modelo");
  };

  const voltarParaEscolhaExistente = () => {
    setCurriculoSelecionado(null);
    setEtapaModal("existente");
  };

  const abrirCurriculo = (curriculo) => {
    abrirVisualizacao(curriculo);
  };

  const nomeUsuario =
    usuario?.nome || "usuário";

  const curriculosCompletos =
    curriculos.filter(
      (curriculo) =>
        curriculo.dados?.completo === true
    ).length;

  const ultimoCurriculo = curriculos[0];

  const formatarData = (data) => {
    if (!data) {
      return "Nenhuma";
    }

    return new Date(data).toLocaleDateString(
      "pt-BR"
    );
  };

  return (
    <main className="mainflow">
      <Sidebar />

      <section className="mainflow-content">
        <header className="mainflow-header">
          <div>
            <span className="header-greeting">
              Boa tarde 👋
            </span>

            <h1>
              Olá, {nomeUsuario}!
            </h1>

            <p>
              Vamos construir seu próximo currículo?
            </p>
          </div>

          <button
            className="profile-button"
            type="button"
            onClick={() => navigate("/perfil")}
          >
            <div className="profile-avatar">
              {nomeUsuario
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>{nomeUsuario}</span>

            <ChevronRight size={17} />
          </button>
        </header>

        <section className="create-card">
          <div className="create-card-content">
            <span className="create-badge">
              <FileText size={15} />
              Seu próximo passo
            </span>

            <h2>
              Crie um currículo que
              <span> destaque você.</span>
            </h2>

            <p>
              Organize suas experiências,
              habilidades e objetivos
              profissionais em um currículo
              moderno e profissional.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={abrirModalCriacao}
            >
              <Plus size={19} />
              Criar novo currículo
            </button>
          </div>

          <div className="create-card-decoration">
            <FileText
              size={150}
              strokeWidth={0.7}
            />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FileText size={20} />
            </div>

            <div>
              <span>
                Currículos criados
              </span>

              <strong>
                {curriculos.length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>
                Currículos completos
              </span>

              <strong>
                {curriculosCompletos}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Clock3 size={20} />
            </div>

            <div>
              <span>
                Última atividade
              </span>

              <strong>
                {formatarData(
                  ultimoCurriculo?.updated_at
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <div>
              <h2>
                Seus currículos
              </h2>

              <p>
                Acompanhe e continue seus
                currículos.
              </p>
            </div>

            <button
              className="view-all"
              type="button"
              onClick={() =>
                navigate("/curriculos")
              }
            >
              Ver todos
              <ChevronRight size={16} />
            </button>
          </div>

          {carregando && (
            <div className="empty-state">
              <p>
                Carregando seus currículos...
              </p>
            </div>
          )}

          {!carregando && erro && (
            <div className="empty-state">
              <h3>
                Não foi possível carregar
                os currículos
              </h3>

              <p>{erro}</p>
            </div>
          )}

          {!carregando &&
            !erro &&
            curriculos.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileText size={28} />
                </div>

                <h3>
                  Você ainda não criou
                  nenhum currículo
                </h3>

                <p>
                  Comece agora e crie seu
                  primeiro currículo
                  profissional com o CVFlow.
                </p>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={abrirModalCriacao}
                >
                  <Plus size={17} />
                  Criar currículo
                </button>
              </div>
            )}

          {!carregando &&
            !erro &&
            curriculos.length > 0 && (
              <div className="curriculos-lista">
                {curriculos
                  .slice(0, 5)
                  .map((curriculo) => (
                    <button
                      className="curriculo-item"
                      key={curriculo.id}
                      type="button"
                      onClick={() =>
                        abrirCurriculo(
                          curriculo
                        )
                      }
                    >
                      <div className="curriculo-item-icon">
                        <FileText size={22} />
                      </div>

                      <div className="curriculo-item-content">
                        <h3>
                          {curriculo.titulo ||
                            "Meu currículo"}
                        </h3>

                        <span>
                          Modelo:{" "}
                          {modelosDisponiveis[
                            curriculo.modelo
                          ]?.nome ||
                            curriculo.modelo}
                        </span>

                        <small>
                          Atualizado em{" "}
                          {formatarData(
                            curriculo.updated_at
                          )}
                        </small>
                      </div>

                      <span className="curriculo-item-button">
                        <ChevronRight size={18} />
                      </span>
                    </button>
                  ))}
              </div>
            )}
        </section>
      </section>

      {curriculoVisualizacao && (
        <div
          className="pdf-export-container"
          ref={previewPdfRef}
        >
          <PreviewCurriculo
            modelo={curriculoVisualizacao.modelo}
            dados={
              curriculoVisualizacao.dados || {}
            }
          />
        </div>
      )}

      {modalAberto && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharModal();
            }
          }}
        >
          <div
            className="modelo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modelo-modal-titulo"
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Fechar"
              onClick={fecharModal}
            >
              <X size={19} />
            </button>

            {etapaModal === "modelo" && (
              <>
                <div className="modal-header">
                  <div className="modal-header-icon">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h2 id="modelo-modal-titulo">
                      Escolha um modelo
                    </h2>

                    <p>
                      Selecione o modelo que
                      deseja usar no seu
                      currículo.
                    </p>
                  </div>
                </div>

                <div className="modelos-modal-lista">
                  {Object.entries(
                    modelosDisponiveis
                  ).map(
                    ([chave, modelo]) => {
                      const existe =
                        curriculos.some(
                          (curriculo) =>
                            curriculo.modelo ===
                            chave
                        );

                      return (
                        <button
                          className="modelo-modal-item"
                          type="button"
                          key={chave}
                          onClick={() =>
                            selecionarModelo(
                              chave
                            )
                          }
                        >
                          <div className="modelo-modal-preview">
                            <FileText
                              size={25}
                            />
                          </div>

                          <div className="modelo-modal-info">
                            <div className="modelo-modal-title">
                              <strong>
                                {modelo.nome}
                              </strong>

                              {existe && (
                                <span className="modelo-existente-badge">
                                  Já utilizado
                                </span>
                              )}
                            </div>

                            <p>
                              {modelo.descricao}
                            </p>
                          </div>

                          <ChevronRight
                            size={18}
                            className="modelo-modal-arrow"
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </>
            )}

            {etapaModal === "confirmar" &&
              modeloSelecionado && (
                <>
                  <div className="modal-header">
                    <div className="modal-header-icon">
                      <Check size={21} />
                    </div>

                    <div>
                      <h2 id="modelo-modal-titulo">
                        Modelo selecionado
                      </h2>

                      <p>
                        Você escolheu o modelo{" "}
                        <strong>
                          {
                            modelosDisponiveis[
                              modeloSelecionado
                            ].nome
                          }
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="modelo-selecionado-box">
                    <div className="modelo-selecionado-icon">
                      <FileText size={25} />
                    </div>

                    <div>
                      <strong>
                        {
                          modelosDisponiveis[
                            modeloSelecionado
                          ].nome
                        }
                      </strong>

                      <p>
                        {
                          modelosDisponiveis[
                            modeloSelecionado
                          ].descricao
                        }
                      </p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="modal-secondary-button"
                      type="button"
                      onClick={
                        voltarParaModelos
                      }
                    >
                      Escolher outro
                    </button>

                    <button
                      className="modal-primary-button"
                      type="button"
                      onClick={iniciarDoZero}
                    >
                      Criar currículo
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}

            {etapaModal === "existente" &&
              modeloSelecionado && (
                <>
                  <div className="modal-header">
                    <div className="modal-header-icon">
                      <FileText size={21} />
                    </div>

                    <div>
                      <h2 id="modelo-modal-titulo">
                        Currículos existentes
                      </h2>

                      <p>
                        Você já possui{" "}
                        <strong>
                          {curriculosDoModelo.length}
                        </strong>{" "}
                        currículo(s) usando o modelo{" "}
                        <strong>
                          {
                            modelosDisponiveis[
                              modeloSelecionado
                            ].nome
                          }
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="modal-question">
                    <h3>
                      O que você deseja fazer?
                    </h3>

                    <p>
                      Escolha um currículo para
                      visualizar ou crie um novo
                      usando este modelo.
                    </p>
                  </div>

                  <div className="curriculos-modal-lista">
                    {curriculosDoModelo.map(
                      (curriculo) => (
                        <div
                          className="curriculo-modal-item"
                          key={curriculo.id}
                        >
                          <div className="curriculo-existente-icon">
                            <FileText size={20} />
                          </div>

                          <div className="curriculo-modal-info">
                            <strong>
                              {curriculo.titulo ||
                                "Meu currículo"}
                            </strong>

                            <small>
                              Atualizado em{" "}
                              {formatarData(
                                curriculo.updated_at
                              )}
                            </small>
                          </div>

                          <button
                            className="curriculo-modal-preview-button"
                            type="button"
                            onClick={() =>
                              abrirVisualizacao(
                                curriculo
                              )
                            }
                          >
                            <Eye size={15} />
                            Visualizar
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <div className="modal-actions">
                    <button
                      className="modal-secondary-button"
                      type="button"
                      onClick={
                        voltarParaModelos
                      }
                    >
                      Escolher outro
                    </button>

                    <button
                      className="modal-primary-button"
                      type="button"
                      onClick={
                        escolherCriarNovo
                      }
                    >
                      <CopyPlus size={17} />
                      Criar novo
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}

            {etapaModal === "dados" &&
              modeloSelecionado && (
                <>
                  <div className="modal-header">
                    <div className="modal-header-icon">
                      <CopyPlus size={21} />
                    </div>

                    <div>
                      <h2 id="modelo-modal-titulo">
                        Como deseja começar?
                      </h2>

                      <p>
                        Você está criando um novo
                        currículo com o modelo{" "}
                        <strong>
                          {
                            modelosDisponiveis[
                              modeloSelecionado
                            ].nome
                          }
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="modal-question">
                    <h3>
                      Começar do zero
                    </h3>

                    <p>
                      Crie um currículo vazio e
                      preencha todas as informações
                      manualmente.
                    </p>
                  </div>

                  <button
                    className="opcao-zero-button"
                    type="button"
                    onClick={iniciarDoZero}
                  >
                    <div className="opcao-zero-icon">
                      <FileText size={19} />
                    </div>

                    <div>
                      <strong>
                        Começar do zero
                      </strong>

                      <span>
                        Usar um currículo vazio
                      </span>
                    </div>

                    <ArrowRight size={17} />
                  </button>

                  <div className="modal-question modal-question-reutilizar">
                    <h3>
                      Ou reutilizar dados
                    </h3>

                    <p>
                      Escolha um currículo do
                      banco para copiar seus dados
                      para o novo currículo.
                    </p>
                  </div>

                  {curriculosDoModelo.length > 0 ? (
                    <div className="curriculos-modal-lista">
                      {curriculosDoModelo.map(
                        (curriculo) => {
                          const selecionado =
                            curriculoSelecionado?.id ===
                            curriculo.id;

                          return (
                            <button
                              className={`curriculo-modal-item curriculo-modal-selecao ${
                                selecionado
                                  ? "selecionado"
                                  : ""
                              }`}
                              type="button"
                              key={curriculo.id}
                              onClick={() =>
                                selecionarCurriculoParaReutilizar(
                                  curriculo
                                )
                              }
                            >
                              <div className="curriculo-existente-icon">
                                <FileText
                                  size={20}
                                />
                              </div>

                              <div className="curriculo-modal-info">
                                <strong>
                                  {curriculo.titulo ||
                                    "Meu currículo"}
                                </strong>

                                <small>
                                  Atualizado em{" "}
                                  {formatarData(
                                    curriculo.updated_at
                                  )}
                                </small>
                              </div>

                              <div className="curriculo-modal-check">
                                {selecionado && (
                                  <Check size={16} />
                                )}
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="sem-dados-reutilizacao">
                      <p>
                        Não existem outros
                        currículos disponíveis
                        para reutilização.
                      </p>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="modal-secondary-button"
                      type="button"
                      onClick={
                        voltarParaEscolhaExistente
                      }
                    >
                      Voltar
                    </button>

                    <button
                      className="modal-primary-button"
                      type="button"
                      onClick={
                        reutilizarDados
                      }
                      disabled={
                        !curriculoSelecionado
                      }
                    >
                      <CopyPlus size={17} />
                      Utilizar dados
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      )}

      {visualizacaoAberta &&
        curriculoVisualizacao && (
          <div
            className="curriculo-preview-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                fecharVisualizacao();
              }
            }}
          >
            <div
              className="curriculo-preview-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="curriculo-preview-titulo"
            >
              <header className="curriculo-preview-header">
                <div className="curriculo-preview-header-info">
                  <span>
                    Pré-visualização
                  </span>

                  <h2 id="curriculo-preview-titulo">
                    {curriculoVisualizacao.titulo ||
                      "Meu currículo"}
                  </h2>

                  <p>
                    Modelo:{" "}
                    {modelosDisponiveis[
                      curriculoVisualizacao.modelo
                    ]?.nome ||
                      curriculoVisualizacao.modelo}
                  </p>
                </div>

                <button
                  className="curriculo-preview-close"
                  type="button"
                  aria-label="Fechar pré-visualização"
                  onClick={
                    fecharVisualizacao
                  }
                  disabled={gerandoPdf}
                >
                  <X size={20} />
                </button>
              </header>

              <div className="curriculo-preview-body">
                <div className="curriculo-preview-sheet">
                  <PreviewCurriculo
                    modelo={
                      curriculoVisualizacao.modelo
                    }
                    dados={
                      curriculoVisualizacao.dados ||
                      {}
                    }
                  />
                </div>
              </div>

              <footer className="curriculo-preview-footer">
                <div className="curriculo-preview-footer-info">
                  {erroExportacao && (
                    <p>
                      {erroExportacao}
                    </p>
                  )}
                </div>

                <div className="curriculo-preview-actions">
                  <button
                    className="curriculo-preview-secondary"
                    type="button"
                    onClick={
                      fecharVisualizacao
                    }
                    disabled={gerandoPdf}
                  >
                    Fechar
                  </button>

                  <button
                    className="curriculo-preview-primary"
                    type="button"
                    onClick={
                      exportarCurriculo
                    }
                    disabled={gerandoPdf}
                  >
                    <Download size={17} />

                    {gerandoPdf
                      ? "Exportando..."
                      : "Exportar"}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        )}
    </main>
  );
};

export default MainFlow;