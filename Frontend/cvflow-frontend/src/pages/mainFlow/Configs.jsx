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

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/auth";

import Sidebar from "../../components/Sidebar/Sidebar";
import "./Configs.css";

const Configs = () => {
  const { logout } = useAuth();

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  const excluirConta = async () => {
    try {
      setExcluindo(true);
      setErro("");

      const token = getToken();

      const resposta = await fetch(
        "http://127.0.0.1:5000/auth/profile",
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
          dados.erro || "Não foi possível excluir a conta."
        );
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      logout();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
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
              Personalize sua experiência e gerencie as configurações
              da sua conta.
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
              <p>Personalize como você utiliza o CVFlow.</p>
            </div>
          </div>

          <div className="configs-divider" />

          <div className="config-option">
            <div className="config-option-info">
              <div className="config-option-icon">
                <Star size={18} />
              </div>

              <div>
                <strong>Currículo principal</strong>
                <span>Selecione seu currículo principal.</span>
              </div>
            </div>

            <select defaultValue="profissional">
              <option value="profissional">
                Currículo Profissional
              </option>

              <option value="estagio">Currículo - Estágio</option>
            </select>
          </div>

          <div className="config-option">
            <div className="config-option-info">
              <div className="config-option-icon">
                <FileText size={18} />
              </div>

              <div>
                <strong>Formato padrão</strong>
                <span>
                  Formato utilizado ao gerar seus currículos.
                </span>
              </div>
            </div>

            <select defaultValue="pdf">
              <option value="pdf">PDF</option>
            </select>
          </div>
        </section>

        <section className="configs-section">
          <div className="configs-section-header">
            <div className="configs-section-icon purple">
              <Shield size={20} />
            </div>

            <div>
              <h2>Segurança</h2>
              <p>Gerencie a segurança e o acesso à sua conta.</p>
            </div>
          </div>

          <div className="configs-divider" />

          <button className="security-option">
            <div className="security-option-left">
              <div className="config-option-icon">
                <Lock size={18} />
              </div>

              <div>
                <strong>Alterar senha</strong>
                <span>Atualize sua senha de acesso.</span>
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
                <strong>Sair da conta</strong>
                <span>Encerrar sua sessão neste dispositivo.</span>
              </div>
            </div>

            <ChevronRight size={18} />
          </button>

          <button
            className="security-option delete-account"
            onClick={() => setMostrarConfirmacao(true)}
          >
            <div className="security-option-left">
              <div className="config-option-icon delete-icon">
                <Trash2 size={18} />
              </div>

              <div>
                <strong>Excluir conta</strong>
                <span>Excluir permanentemente sua conta e seus dados.</span>
              </div>
            </div>

            <ChevronRight size={18} />
          </button>
        </section>

        <div className="configs-footer">
          <button className="configs-save-button">
            <Save size={18} />
            Salvar alterações
          </button>
        </div>
      </section>

      {mostrarConfirmacao && (
        <div className="delete-modal-overlay">
          <div className="delete-confirmation-card">
            <button
              className="delete-modal-close"
              onClick={() => setMostrarConfirmacao(false)}
              aria-label="Fechar confirmação"
            >
              <X size={18} />
            </button>

            <div className="delete-confirmation-icon">
              <AlertTriangle size={25} />
            </div>

            <h2>Excluir sua conta?</h2>

            <p>
              Essa ação é permanente e irreversível. Todos os dados
              associados à sua conta poderão ser excluídos.
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
                onClick={() => setMostrarConfirmacao(false)}
                disabled={excluindo}
              >
                Cancelar
              </button>

              <button
                className="delete-confirm-button"
                onClick={excluirConta}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo..." : "Excluir conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Configs;