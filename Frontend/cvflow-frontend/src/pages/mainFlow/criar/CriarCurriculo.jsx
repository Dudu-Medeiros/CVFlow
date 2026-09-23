import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  FolderGit2,
  Languages,
  BookOpen,
  Link as LinkIcon,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import "./CriarCurriculo.css";
import PreviewCurriculo from "../../../components/CriarCurriculo/PreviewCurriculo";
import { getToken } from "../../../utils/auth";

const criarId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const campoVazio = {
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
  localizacao: "",
  foto: "",
  resumo: "",
  links: [],
  experiencias: [],
  formacao: [],
  habilidades: [],
  projetos: [],
  idiomas: [],
  cursos: [],
};

const modelosIniciais = {
  link: {
    url: "",
  },

  experiencia: {
    empresa: "",
    funcao: "",
    periodo: "",
    atividades: "",
  },

  formacao: {
    curso: "",
    instituicao: "",
    periodo: "",
    descricao: "",
  },

  habilidade: {
    nome: "",
  },

  projeto: {
    nome: "",
    descricao: "",
    tecnologias: "",
    link: "",
  },

  idioma: {
    idioma: "",
    nivel: "",
  },

  curso: {
    nome: "",
    instituicao: "",
    periodo: "",
    descricao: "",
  },
};

function normalizarDados(dados = {}) {
  return {
    ...campoVazio,
    ...dados,

    links: Array.isArray(dados.links)
      ? dados.links
      : [],

    experiencias: Array.isArray(
      dados.experiencias
    )
      ? dados.experiencias
      : [],

    formacao: Array.isArray(dados.formacao)
      ? dados.formacao
      : [],

    habilidades: Array.isArray(
      dados.habilidades
    )
      ? dados.habilidades
      : [],

    projetos: Array.isArray(dados.projetos)
      ? dados.projetos
      : [],

    idiomas: Array.isArray(dados.idiomas)
      ? dados.idiomas
      : [],

    cursos: Array.isArray(dados.cursos)
      ? dados.cursos
      : [],
  };
}

function Campo({
  label,
  children,
  completo = false,
}) {
  return (
    <div
      className={`campo-grupo ${
        completo ? "campo-completo" : ""
      }`}
    >
      <label>{label}</label>
      {children}
    </div>
  );
}

function BotaoAdicionar({
  children,
  onClick,
}) {
  return (
    <button
      className="botao-adicionar"
      type="button"
      onClick={onClick}
    >
      <Plus size={16} />
      {children}
    </button>
  );
}

function BotaoRemover({ onClick }) {
  return (
    <button
      className="botao-remover"
      type="button"
      onClick={onClick}
      aria-label="Remover item"
    >
      <Trash2 size={15} />
    </button>
  );
}

function TituloSecao({
  numero,
  icone: Icon,
  titulo,
  descricao,
}) {
  return (
    <div className="editor-secao-cabecalho">
      <span>{numero}</span>

      <div>
        <div className="titulo-com-icone">
          <Icon size={18} />
          <h2>{titulo}</h2>
        </div>

        <p>{descricao}</p>
      </div>
    </div>
  );
}

function CabecalhoDinamico({
  icone: Icon,
  titulo,
  descricao,
  onClick,
}) {
  return (
    <div className="dinamica-cabecalho">
      <div>
        <h3>
          <Icon size={17} />
          {titulo}
        </h3>

        <p>{descricao}</p>
      </div>

      <BotaoAdicionar onClick={onClick}>
        Adicionar
      </BotaoAdicionar>
    </div>
  );
}

function CampoTexto({
  label,
  value,
  placeholder,
  onChange,
  tipo = "text",
  completo = false,
}) {
  return (
    <Campo
      label={label}
      completo={completo}
    >
      <input
        type={tipo}
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />
    </Campo>
  );
}

function CampoArea({
  label,
  value,
  placeholder,
  onChange,
}) {
  return (
    <Campo
      label={label}
      completo
    >
      <textarea
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />
    </Campo>
  );
}

function ItemDinamico({
  titulo,
  onRemove,
  children,
}) {
  return (
    <div className="item-dinamico">
      <div className="item-dinamico-topo">
        <strong>{titulo}</strong>

        <BotaoRemover
          onClick={onRemove}
        />
      </div>

      {children}
    </div>
  );
}

export default function CriarCurriculo() {
  const navigate = useNavigate();
  const location = useLocation();

  const modoEdicao =
    location.state?.modoEdicao === true;

  const curriculoEdicao =
    location.state?.curriculo || null;

  const reutilizarDados =
    location.state?.reutilizarDados === true;

  const dadosIniciais =
    location.state?.dadosIniciais || null;

  const [
    tituloCurriculo,
    setTituloCurriculo,
  ] = useState(() => {
    if (
      modoEdicao &&
      curriculoEdicao?.titulo
    ) {
      return curriculoEdicao.titulo;
    }

    if (
      !modoEdicao &&
      reutilizarDados &&
      curriculoEdicao?.titulo
    ) {
      return `${curriculoEdicao.titulo} - Novo`;
    }

    return "Meu currículo";
  });

  const [
    modeloSelecionado,
    setModeloSelecionado,
  ] = useState(() => {
    if (
      modoEdicao &&
      curriculoEdicao?.modelo
    ) {
      return curriculoEdicao.modelo;
    }

    return (
      location.state?.modeloSelecionado ||
      "ats"
    );
  });

  const [
    dadosCurriculo,
    setDadosCurriculo,
  ] = useState(() => {
    if (
      modoEdicao &&
      curriculoEdicao?.dados
    ) {
      return normalizarDados(
        curriculoEdicao.dados
      );
    }

    if (
      !modoEdicao &&
      reutilizarDados &&
      dadosIniciais
    ) {
      return normalizarDados(
        dadosIniciais
      );
    }

    return normalizarDados();
  });

  const [
    notificacao,
    setNotificacao,
  ] = useState(null);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  useEffect(() => {
    if (!notificacao) {
      return;
    }

    const timer = setTimeout(() => {
      setNotificacao(null);
    }, 4500);

    return () => clearTimeout(timer);
  }, [notificacao]);

  function mostrarNotificacao(
    tipo,
    titulo,
    mensagem
  ) {
    setNotificacao({
      tipo,
      titulo,
      mensagem,
      id: Date.now(),
    });
  }

  function fecharNotificacao() {
    setNotificacao(null);
  }

  function atualizarCampo(
    campo,
    valor
  ) {
    setDadosCurriculo(
      (dadosAtuais) => ({
        ...dadosAtuais,
        [campo]: valor,
      })
    );
  }

  function adicionarItem(
    campo,
    tipo
  ) {
    setDadosCurriculo(
      (dadosAtuais) => ({
        ...dadosAtuais,

        [campo]: [
          ...(dadosAtuais[campo] || []),
          {
            id: criarId(),
            ...modelosIniciais[tipo],
          },
        ],
      })
    );
  }

  function atualizarItem(
    campo,
    id,
    propriedade,
    valor
  ) {
    setDadosCurriculo(
      (dadosAtuais) => ({
        ...dadosAtuais,

        [campo]: (
          dadosAtuais[campo] || []
        ).map((item) =>
          item.id === id
            ? {
                ...item,
                [propriedade]: valor,
              }
            : item
        ),
      })
    );
  }

  function removerItem(
    campo,
    id
  ) {
    setDadosCurriculo(
      (dadosAtuais) => ({
        ...dadosAtuais,

        [campo]: (
          dadosAtuais[campo] || []
        ).filter(
          (item) => item.id !== id
        ),
      })
    );
  }

  function selecionarFoto(event) {
    const arquivo =
      event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (
      !arquivo.type.startsWith(
        "image/"
      )
    ) {
      mostrarNotificacao(
        "erro",
        "Imagem inválida",
        "Selecione um arquivo de imagem válido."
      );

      return;
    }

    if (
      arquivo.size >
      2 * 1024 * 1024
    ) {
      mostrarNotificacao(
        "erro",
        "Imagem muito grande",
        "A imagem deve ter no máximo 2 MB."
      );

      return;
    }

    const leitor =
      new FileReader();

    leitor.onload = () => {
      atualizarCampo(
        "foto",
        leitor.result
      );
    };

    leitor.readAsDataURL(arquivo);
  }

  function removerFoto() {
    atualizarCampo(
      "foto",
      ""
    );
  }

  function alterarModelo() {
    navigate("/modelos");
  }

  async function salvarCurriculo() {
    const token = getToken();

    if (!token) {
      mostrarNotificacao(
        "erro",
        "Sessão expirada",
        "Faça login novamente para continuar."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);

      return;
    }

    if (
      modoEdicao &&
      !curriculoEdicao?.id
    ) {
      mostrarNotificacao(
        "erro",
        "Não foi possível salvar",
        "Não foi possível identificar o currículo que será editado."
      );

      return;
    }

    const titulo =
      tituloCurriculo.trim();

    if (!titulo) {
      mostrarNotificacao(
        "erro",
        "Nome do currículo",
        "Informe um nome para o currículo antes de salvar."
      );

      return;
    }

    try {
      setSalvando(true);

      const url = modoEdicao
        ? `http://localhost:5000/curriculos/${curriculoEdicao.id}`
        : "http://localhost:5000/curriculos";

      const metodo = modoEdicao
        ? "PUT"
        : "POST";

      const resposta =
        await fetch(url, {
          method: metodo,

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            titulo,
            modelo:
              modeloSelecionado,
            dados: dadosCurriculo,
          }),
        });

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            (modoEdicao
              ? "Não foi possível atualizar o currículo."
              : "Não foi possível salvar o currículo.")
        );
      }

      mostrarNotificacao(
        "sucesso",

        modoEdicao
          ? "Currículo atualizado!"
          : "Currículo salvo!",

        modoEdicao
          ? "As alterações foram salvas com sucesso."
          : "Seu currículo foi salvo e já está disponível na sua lista."
      );

      setTimeout(() => {
        navigate("/curriculos");
      }, 1600);
    } catch (erro) {
      console.error(
        modoEdicao
          ? "Erro ao atualizar currículo:"
          : "Erro ao salvar currículo:",
        erro
      );

      mostrarNotificacao(
        "erro",
        "Não foi possível salvar",
        erro.message ||
          "Ocorreu um erro ao conectar com o servidor."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="criar-curriculo-page">
      {notificacao && (
        <div
          className={`cvflow-notificacao cvflow-notificacao-${notificacao.tipo}`}
          role="status"
          aria-live="polite"
          key={notificacao.id}
        >
          <div className="cvflow-notificacao-icone">
            {notificacao.tipo ===
            "sucesso" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>

          <div className="cvflow-notificacao-conteudo">
            <strong>
              {notificacao.titulo}
            </strong>

            <p>
              {notificacao.mensagem}
            </p>
          </div>

          <button
            className="cvflow-notificacao-fechar"
            type="button"
            onClick={
              fecharNotificacao
            }
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>

          <div className="cvflow-notificacao-progresso" />
        </div>
      )}

      <header className="editor-header">
        <button
          className="editor-voltar"
          type="button"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={17} />
          <span>Voltar</span>
        </button>

        <div className="editor-titulo">
          <BookOpen size={20} />

          <div className="editor-titulo-conteudo">
            <h1>
              {modoEdicao
                ? "Editar currículo"
                : "Novo currículo"}
            </h1>

            <div className="editor-nome-curriculo">
              <label htmlFor="titulo-curriculo">
                Nome do currículo
              </label>

              <input
                id="titulo-curriculo"
                type="text"
                value={
                  tituloCurriculo
                }
                onChange={(event) =>
                  setTituloCurriculo(
                    event.target.value
                  )
                }
                placeholder="Ex.: Currículo Front-End"
                maxLength={150}
              />
            </div>
          </div>
        </div>

        <button
          className="editor-salvar"
          type="button"
          onClick={
            salvarCurriculo
          }
          disabled={salvando}
        >
          <Save size={16} />

          {salvando
            ? "Salvando..."
            : modoEdicao
            ? "Salvar alterações"
            : "Salvar"}
        </button>
      </header>

      <div className="editor-modelo">
        <div className="editor-modelo-informacao">
          <span>
            Modelo selecionado:
          </span>

          <strong>
            {modeloSelecionado.toUpperCase()}
          </strong>
        </div>

        <button
          type="button"
          onClick={alterarModelo}
        >
          Alterar modelo
        </button>
      </div>

      <div className="editor-layout">
        <section className="editor-formulario">
          <TituloSecao
            numero="01"
            icone={UserRound}
            titulo="Informações pessoais"
            descricao="Preencha somente as informações que deseja exibir no currículo."
          />

          <div className="editor-form-grid">
            <CampoTexto
              label="Nome completo"
              value={
                dadosCurriculo.nome
              }
              onChange={(valor) =>
                atualizarCampo(
                  "nome",
                  valor
                )
              }
              placeholder="Digite seu nome completo"
              completo
            />

            <CampoTexto
              label="Cargo desejado"
              value={
                dadosCurriculo.cargo
              }
              onChange={(valor) =>
                atualizarCampo(
                  "cargo",
                  valor
                )
              }
              placeholder="Ex.: Desenvolvedor Front-End"
              completo
            />

            <CampoTexto
              label="E-mail"
              tipo="email"
              value={
                dadosCurriculo.email
              }
              onChange={(valor) =>
                atualizarCampo(
                  "email",
                  valor
                )
              }
              placeholder="seuemail@email.com"
            />

            <CampoTexto
              label="Telefone"
              value={
                dadosCurriculo.telefone
              }
              onChange={(valor) =>
                atualizarCampo(
                  "telefone",
                  valor
                )
              }
              placeholder="(00) 00000-0000"
            />

            <CampoTexto
              label="Localização"
              value={
                dadosCurriculo.localizacao
              }
              onChange={(valor) =>
                atualizarCampo(
                  "localizacao",
                  valor
                )
              }
              placeholder="Cidade - Estado"
              completo
            />

            {modeloSelecionado ===
              "moderno" && (
              <Campo
                label="Foto de perfil"
                completo
              >
                <div className="foto-upload">
                  <input
                    id="foto-perfil"
                    type="file"
                    accept="image/*"
                    onChange={
                      selecionarFoto
                    }
                  />

                  <label htmlFor="foto-perfil">
                    <ImagePlus size={17} />
                    Selecionar imagem
                  </label>

                  {dadosCurriculo.foto && (
                    <button
                      type="button"
                      className="botao-remover-foto"
                      onClick={
                        removerFoto
                      }
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </Campo>
            )}

            <CampoArea
              label="Resumo profissional"
              value={
                dadosCurriculo.resumo
              }
              onChange={(valor) =>
                atualizarCampo(
                  "resumo",
                  valor
                )
              }
              placeholder="Escreva uma breve apresentação profissional..."
            />
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={LinkIcon}
              titulo="Links profissionais"
              descricao="Adicione somente as URLs que deseja exibir."
              onClick={() =>
                adicionarItem(
                  "links",
                  "link"
                )
              }
            />

            {dadosCurriculo.links.map(
              (link, index) => (
                <ItemDinamico
                  key={link.id}
                  titulo={`Link ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "links",
                      link.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="URL"
                      tipo="url"
                      value={link.url}
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "links",
                          link.id,
                          "url",
                          valor
                        )
                      }
                      placeholder="https://..."
                      completo
                    />
                  </div>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={
                BriefcaseBusiness
              }
              titulo="Experiência profissional"
              descricao="Adicione empresas, funções, períodos e atividades."
              onClick={() =>
                adicionarItem(
                  "experiencias",
                  "experiencia"
                )
              }
            />

            {dadosCurriculo.experiencias.map(
              (
                experiencia,
                index
              ) => (
                <ItemDinamico
                  key={
                    experiencia.id
                  }
                  titulo={`Experiência ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "experiencias",
                      experiencia.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Nome da empresa"
                      value={
                        experiencia.empresa
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "experiencias",
                          experiencia.id,
                          "empresa",
                          valor
                        )
                      }
                      placeholder="Nome da empresa"
                    />

                    <CampoTexto
                      label="Função exercida"
                      value={
                        experiencia.funcao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "experiencias",
                          experiencia.id,
                          "funcao",
                          valor
                        )
                      }
                      placeholder="Cargo exercido"
                    />

                    <CampoTexto
                      label="Período"
                      value={
                        experiencia.periodo
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "experiencias",
                          experiencia.id,
                          "periodo",
                          valor
                        )
                      }
                      placeholder="Ex.: Maio de 2025 - Atual"
                      completo
                    />

                    <CampoArea
                      label="Resumo das atividades"
                      value={
                        experiencia.atividades
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "experiencias",
                          experiencia.id,
                          "atividades",
                          valor
                        )
                      }
                      placeholder="Descreva suas responsabilidades, tecnologias e resultados..."
                    />
                  </div>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={
                GraduationCap
              }
              titulo="Formação acadêmica"
              descricao="Adicione seus cursos e instituições de ensino."
              onClick={() =>
                adicionarItem(
                  "formacao",
                  "formacao"
                )
              }
            />

            {dadosCurriculo.formacao.map(
              (formacao, index) => (
                <ItemDinamico
                  key={formacao.id}
                  titulo={`Formação ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "formacao",
                      formacao.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Curso"
                      value={
                        formacao.curso
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "formacao",
                          formacao.id,
                          "curso",
                          valor
                        )
                      }
                      placeholder="Nome do curso"
                    />

                    <CampoTexto
                      label="Instituição"
                      value={
                        formacao.instituicao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "formacao",
                          formacao.id,
                          "instituicao",
                          valor
                        )
                      }
                      placeholder="Instituição de ensino"
                    />

                    <CampoTexto
                      label="Período"
                      value={
                        formacao.periodo
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "formacao",
                          formacao.id,
                          "periodo",
                          valor
                        )
                      }
                      placeholder="Ex.: 2025 - 2028"
                      completo
                    />

                    <CampoArea
                      label="Descrição"
                      value={
                        formacao.descricao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "formacao",
                          formacao.id,
                          "descricao",
                          valor
                        )
                      }
                      placeholder="Informações adicionais, se necessário..."
                    />
                  </div>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={Code2}
              titulo="Habilidades"
              descricao="Adicione grupos de habilidades em um único campo."
              onClick={() =>
                adicionarItem(
                  "habilidades",
                  "habilidade"
                )
              }
            />

            {dadosCurriculo.habilidades.map(
              (
                habilidade,
                index
              ) => (
                <ItemDinamico
                  key={
                    habilidade.id
                  }
                  titulo={`Grupo de habilidades ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "habilidades",
                      habilidade.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Habilidades"
                      value={
                        habilidade.nome
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "habilidades",
                          habilidade.id,
                          "nome",
                          valor
                        )
                      }
                      placeholder="Ex.: React, JavaScript, Python, Git, SQL..."
                      completo
                    />
                  </div>

                  <p className="campo-ajuda">
                    Separe as habilidades
                    por vírgulas.
                  </p>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={FolderGit2}
              titulo="Projetos"
              descricao="Mostre projetos pessoais, acadêmicos ou profissionais."
              onClick={() =>
                adicionarItem(
                  "projetos",
                  "projeto"
                )
              }
            />

            {dadosCurriculo.projetos.map(
              (projeto, index) => (
                <ItemDinamico
                  key={projeto.id}
                  titulo={`Projeto ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "projetos",
                      projeto.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Nome do projeto"
                      value={
                        projeto.nome
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "projetos",
                          projeto.id,
                          "nome",
                          valor
                        )
                      }
                      placeholder="Nome do projeto"
                      completo
                    />

                    <CampoTexto
                      label="Tecnologias utilizadas"
                      value={
                        projeto.tecnologias
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "projetos",
                          projeto.id,
                          "tecnologias",
                          valor
                        )
                      }
                      placeholder="React, Flask, PostgreSQL..."
                      completo
                    />

                    <CampoTexto
                      label="Link do projeto"
                      tipo="url"
                      value={
                        projeto.link
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "projetos",
                          projeto.id,
                          "link",
                          valor
                        )
                      }
                      placeholder="https://..."
                      completo
                    />

                    <CampoArea
                      label="Descrição"
                      value={
                        projeto.descricao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "projetos",
                          projeto.id,
                          "descricao",
                          valor
                        )
                      }
                      placeholder="Descreva o objetivo, funcionalidades e resultados..."
                    />
                  </div>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={Languages}
              titulo="Idiomas"
              descricao="Adicione os idiomas que deseja apresentar."
              onClick={() =>
                adicionarItem(
                  "idiomas",
                  "idioma"
                )
              }
            />

            {dadosCurriculo.idiomas.map(
              (idioma, index) => (
                <ItemDinamico
                  key={idioma.id}
                  titulo={`Idioma ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "idiomas",
                      idioma.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Idioma"
                      value={
                        idioma.idioma
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "idiomas",
                          idioma.id,
                          "idioma",
                          valor
                        )
                      }
                      placeholder="Ex.: Inglês"
                    />

                    <Campo label="Nível">
                      <select
                        value={
                          idioma.nivel
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarItem(
                            "idiomas",
                            idioma.id,
                            "nivel",
                            event.target
                              .value
                          )
                        }
                      >
                        <option value="">
                          Selecionar nível
                        </option>

                        <option value="Básico">
                          Básico
                        </option>

                        <option value="Intermediário">
                          Intermediário
                        </option>

                        <option value="Avançado">
                          Avançado
                        </option>

                        <option value="Fluente">
                          Fluente
                        </option>

                        <option value="Nativo">
                          Nativo
                        </option>
                      </select>
                    </Campo>
                  </div>
                </ItemDinamico>
              )
            )}
          </div>

          <div className="editor-secao-dinamica">
            <CabecalhoDinamico
              icone={BookOpen}
              titulo="Cursos e certificações"
              descricao="Inclua cursos, certificações e capacitações."
              onClick={() =>
                adicionarItem(
                  "cursos",
                  "curso"
                )
              }
            />

            {dadosCurriculo.cursos.map(
              (curso, index) => (
                <ItemDinamico
                  key={curso.id}
                  titulo={`Curso ${
                    index + 1
                  }`}
                  onRemove={() =>
                    removerItem(
                      "cursos",
                      curso.id
                    )
                  }
                >
                  <div className="editor-form-grid">
                    <CampoTexto
                      label="Nome do curso"
                      value={
                        curso.nome
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "cursos",
                          curso.id,
                          "nome",
                          valor
                        )
                      }
                      placeholder="Nome do curso ou certificação"
                      completo
                    />

                    <CampoTexto
                      label="Instituição"
                      value={
                        curso.instituicao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "cursos",
                          curso.id,
                          "instituicao",
                          valor
                        )
                      }
                      placeholder="Instituição"
                    />

                    <CampoTexto
                      label="Período"
                      value={
                        curso.periodo
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "cursos",
                          curso.id,
                          "periodo",
                          valor
                        )
                      }
                      placeholder="Ano ou duração"
                    />

                    <CampoArea
                      label="Descrição"
                      value={
                        curso.descricao
                      }
                      onChange={(
                        valor
                      ) =>
                        atualizarItem(
                          "cursos",
                          curso.id,
                          "descricao",
                          valor
                        )
                      }
                      placeholder="Informações adicionais..."
                    />
                  </div>
                </ItemDinamico>
              )
            )}
          </div>
        </section>

        <aside className="editor-preview-container">
          <div className="preview-cabecalho">
            <div>
              <span>
                Prévia do currículo
              </span>

              <h2>
                {modeloSelecionado.toUpperCase()}
              </h2>
            </div>

            <span className="preview-status">
              Ao vivo
            </span>
          </div>

          <div className="preview-area">
            <div className="preview-pagina">
              <PreviewCurriculo
                modelo={
                  modeloSelecionado
                }
                dados={
                  dadosCurriculo
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}