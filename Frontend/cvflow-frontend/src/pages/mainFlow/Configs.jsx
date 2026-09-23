import {
  FileText,
  Shield,
  Lock,
  LogOut,
  Save,
  ChevronRight,
  Star,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/auth";

import Sidebar from "../../components/Sidebar/Sidebar";
import "./Configs.css";

const API_URL = "http://127.0.0.1:5000";

const Configs = () => {
  const { logout } = useAuth();

  const [curriculos, setCurriculos] = useState([]);
  const [curriculoPrincipal, setCurriculoPrincipal] = useState("");
  const [formatoPadrao, setFormatoPadrao] = useState("pdf");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [mensagemSenha, setMensagemSenha] = useState("");

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        setCarregando(true);
        setErro("");

        const token = getToken();

        const [respostaCurriculos, respostaConfiguracoes] =
          await Promise.all([
            fetch(`${API_URL}/curriculos`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(`${API_URL}/auth/settings`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const dadosCurriculos =
          await respostaCurriculos.json();

        const dadosConfiguracoes =
          await respostaConfiguracoes.json();

        if (!respostaCurriculos.ok) {
          throw new Error(
            dadosCurriculos.erro ||
              "Não foi possível carregar seus currículos."
          );
        }

        if (!respostaConfiguracoes.ok) {
          throw new Error(
            dadosConfiguracoes.erro ||
              "Não foi possível carregar suas configurações."
          );
        }

        setCurriculos(
          Array.isArray(dadosCurriculos)
            ? dadosCurriculos
            : Array.isArray(dadosCurriculos.curriculos)
            ? dadosCurriculos.curriculos
            : []
        );

        const configuracoes =
          dadosConfiguracoes.configuracoes || {};

        setCurriculoPrincipal(
          configuracoes.curriculo_principal_id
            ? String(configuracoes.curriculo_principal_id)
            : ""
        );

        setFormatoPadrao(
          configuracoes.formato_padrao || "pdf"
        );
      } catch (error) {
        console.error(
          "Erro ao carregar configurações:",
          error
        );

        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarConfiguracoes();
  }, []);

  const salvarConfiguracoes = async () => {
    try {
      setSalvando(true);
      setMensagem("");
      setErro("");

      const token = getToken();

      const resposta = await fetch(
        `${API_URL}/auth/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            curriculo_principal_id: curriculoPrincipal
              ? Number(curriculoPrincipal)
              : null,
            formato_padrao: formatoPadrao,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível salvar as configurações."
        );
      }

      setMensagem(
        dados.mensagem ||
          "Configurações salvas com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao salvar configurações:",
        error
      );

      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const abrirModalSenha = () => {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setErroSenha("");
    setMensagemSenha("");
    setMostrarSenha(true);
  };

  const alterarSenha = async () => {
    try {
      setErroSenha("");
      setMensagemSenha("");

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        setErroSenha(
          "Preencha todos os campos."
        );
        return;
      }

      if (novaSenha.length < 6) {
        setErroSenha(
          "A nova senha deve ter pelo menos 6 caracteres."
        );
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setErroSenha(
          "A confirmação da nova senha não coincide."
        );
        return;
      }

      setAlterandoSenha(true);

      const token = getToken();

      const resposta = await fetch(
        `${API_URL}/auth/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senha_atual: senhaAtual,
            nova_senha: novaSenha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível alterar a senha."
        );
      }

      setMensagemSenha(
        dados.mensagem ||
          "Senha alterada com sucesso!"
      );

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error(
        "Erro ao alterar senha:",
        error
      );

      setErroSenha(error.message);
    } finally {
      setAlterandoSenha(false);
    }
  };

  const excluirConta = async () => {
    try {
      setExcluindo(true);
      setErro("");

      const token = getToken();

      const resposta = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível excluir a conta."
        );
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      logout();
    } catch (error) {
      console.error(
        "Erro ao excluir conta:",
        error
      );

      setErro(error.message);
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <main className="configs-page">
      <Sidebar />

      <section className="configs-content">
        <header className="configs-header">
          <div>
            <span className="configs-badge">
              <Star size={14} />
              Preferências
            </span>

            <h1>Configurações</h1>

            <p>
              Personalize sua experiência e gerencie as
              configurações da sua conta.
            </p>
          </div>
        </header>

        <section className="configs-section">
          <div className="configs-section-header">
            <div className="configs-section-icon blue">
              <FileText size={20} />
            </div>

            <div>
              <h2>Preferências</h2>

              <p>
                Personalize como você utiliza o CVFlow.
              </p>
            </div>
          </div>

          <div className="configs-divider" />

          {carregando ? (
            <div className="configs-loading">
              Carregando configurações...
            </div>
          ) : (
            <>
              <div className="config-option">
                <div className="config-option-info">
                  <div className="config-option-icon">
                    <Star size={18} />
                  </div>

                  <div>
                    <strong>
                      Currículo principal
                    </strong>

                    <span>
                      Selecione seu currículo principal.
                    </span>
                  </div>
                </div>

                <select
                  value={curriculoPrincipal}
                  onChange={(event) =>
                    setCurriculoPrincipal(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Nenhum selecionado
                  </option>

                  {curriculos.map((curriculo) => (
                    <option
                      key={curriculo.id}
                      value={curriculo.id}
                    >
                      {curriculo.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="config-option">
                <div className="config-option-info">
                  <div className="config-option-icon">
                    <FileText size={18} />
                  </div>

                  <div>
                    <strong>
                      Formato padrão
                    </strong>

                    <span>
                      Formato utilizado ao gerar seus
                      currículos.
                    </span>
                  </div>
                </div>

                <select
                  value={formatoPadrao}
                  onChange={(event) =>
                    setFormatoPadrao(
                      event.target.value
                    )
                  }
                >
                  <option value="pdf">
                    PDF
                  </option>
                </select>
              </div>
            </>
          )}
        </section>

        <section className="configs-section">
          <div className="configs-section-header">
            <div className="configs-section-icon purple">
              <Shield size={20} />
            </div>

            <div>
              <h2>Segurança</h2>

              <p>
                Gerencie a segurança e o acesso à sua conta.
              </p>
            </div>
          </div>

          <div className="configs-divider" />

          <button
            className="security-option"
            onClick={abrirModalSenha}
          >
            <div className="security-option-left">
              <div className="config-option-icon">
                <Lock size={18} />
              </div>

              <div>
                <strong>
                  Alterar senha
                </strong>

                <span>
                  Atualize sua senha de acesso.
                </span>
              </div>
            </div>

            <ChevronRight size={18} />
          </button>

          <button
            className="security-option danger"
            onClick={logout}
          >
            <div className="security-option-left">
              <div className="config-option-icon danger-icon">
                <LogOut size={18} />
              </div>

              <div>
                <strong>
                  Sair da conta
                </strong>

                <span>
                  Encerrar sua sessão neste dispositivo.
                </span>
              </div>
            </div>

            <ChevronRight size={18} />
          </button>

          <button
            className="security-option delete-account"
            onClick={() =>
              setMostrarConfirmacao(true)
            }
          >
            <div className="security-option-left">
              <div className="config-option-icon delete-icon">
                <Trash2 size={18} />
              </div>

              <div>
                <strong>
                  Excluir conta
                </strong>

                <span>
                  Excluir permanentemente sua conta e
                  seus dados.
                </span>
              </div>
            </div>

            <ChevronRight size={18} />
          </button>
        </section>

        {erro && (
          <div className="configs-feedback error">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="configs-feedback success">
            {mensagem}
          </div>
        )}

        <div className="configs-footer">
          <button
            className="configs-save-button"
            onClick={salvarConfiguracoes}
            disabled={carregando || salvando}
          >
            <Save size={18} />

            {salvando
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </div>
      </section>

      {mostrarSenha && (
        <div className="password-modal-overlay">
          <div className="password-confirmation-card">
            <button
              className="delete-modal-close"
              onClick={() =>
                setMostrarSenha(false)
              }
              aria-label="Fechar alteração de senha"
            >
              <X size={18} />
            </button>

            <div className="password-confirmation-icon">
              <Lock size={24} />
            </div>

            <h2>Alterar senha</h2>

            <p>
              Informe sua senha atual e defina uma nova
              senha para sua conta.
            </p>

            <div className="password-form">
              <label>
                Senha atual

                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(event) =>
                    setSenhaAtual(
                      event.target.value
                    )
                  }
                  placeholder="Digite sua senha atual"
                />
              </label>

              <label>
                Nova senha

                <input
                  type="password"
                  value={novaSenha}
                  onChange={(event) =>
                    setNovaSenha(
                      event.target.value
                    )
                  }
                  placeholder="Digite a nova senha"
                />
              </label>

              <label>
                Confirmar nova senha

                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(
                      event.target.value
                    )
                  }
                  placeholder="Confirme a nova senha"
                />
              </label>
            </div>

            {erroSenha && (
              <p className="password-error">
                {erroSenha}
              </p>
            )}

            {mensagemSenha && (
              <p className="password-success">
                {mensagemSenha}
              </p>
            )}

            <div className="password-confirmation-actions">
              <button
                className="delete-cancel-button"
                onClick={() =>
                  setMostrarSenha(false)
                }
                disabled={alterandoSenha}
              >
                Cancelar
              </button>

              <button
                className="password-confirm-button"
                onClick={alterarSenha}
                disabled={alterandoSenha}
              >
                {alterandoSenha
                  ? "Alterando..."
                  : "Alterar senha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacao && (
        <div className="delete-modal-overlay">
          <div className="delete-confirmation-card">
            <button
              className="delete-modal-close"
              onClick={() =>
                setMostrarConfirmacao(false)
              }
              aria-label="Fechar confirmação"
            >
              <X size={18} />
            </button>

            <div className="delete-confirmation-icon">
              <AlertTriangle size={25} />
            </div>

            <h2>Excluir sua conta?</h2>

            <p>
              Essa ação é permanente e irreversível.
              Todos os dados associados à sua conta
              poderão ser excluídos.
            </p>

            <strong className="delete-warning">
              Você não poderá desfazer essa ação.
            </strong>

            {erro && (
              <p className="delete-error">
                {erro}
              </p>
            )}

            <div className="delete-confirmation-actions">
              <button
                className="delete-cancel-button"
                onClick={() =>
                  setMostrarConfirmacao(false)
                }
                disabled={excluindo}
              >
                Cancelar
              </button>

              <button
                className="delete-confirm-button"
                onClick={excluirConta}
                disabled={excluindo}
              >
                {excluindo
                  ? "Excluindo..."
                  : "Excluir conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Configs;