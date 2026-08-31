import {
  FileText,
  Shield,
  Lock,
  LogOut,
  Save,
  ChevronRight,
  Star,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";

import "./Configs.css";

const Configs = () => {
  return (
    <main className="configs-page">

      {/* SIDEBAR */}

      <Sidebar />


      {/* CONTEÚDO */}

      <section className="configs-content">

        {/* HEADER */}

        <header className="configs-header">

          <div>

            <span className="configs-badge">
              <Star size={14} />
              Preferências
            </span>

            <h1>
              Configurações
            </h1>

            <p>
              Personalize sua experiência e gerencie as configurações
              da sua conta.
            </p>

          </div>

        </header>


        {/* PREFERÊNCIAS */}

        <section className="configs-section">

          <div className="configs-section-header">

            <div className="configs-section-icon blue">
              <FileText size={20} />
            </div>

            <div>

              <h2>
                Preferências
              </h2>

              <p>
                Personalize como você utiliza o CVFlow.
              </p>

            </div>

          </div>


          <div className="configs-divider" />


          {/* CURRÍCULO PRINCIPAL */}

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


            <select defaultValue="profissional">

              <option value="profissional">
                Currículo Profissional
              </option>

              <option value="estagio">
                Currículo - Estágio
              </option>

            </select>

          </div>


          {/* FORMATO PADRÃO */}

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
                  Formato utilizado ao gerar seus currículos.
                </span>

              </div>

            </div>


            <select defaultValue="pdf">

              <option value="pdf">
                PDF
              </option>

            </select>

          </div>

        </section>


        {/* SEGURANÇA */}

        <section className="configs-section">

          <div className="configs-section-header">

            <div className="configs-section-icon purple">
              <Shield size={20} />
            </div>

            <div>

              <h2>
                Segurança
              </h2>

              <p>
                Gerencie a segurança e o acesso à sua conta.
              </p>

            </div>

          </div>


          <div className="configs-divider" />


          {/* ALTERAR SENHA */}

          <button className="security-option">

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


          {/* SAIR */}

          <button className="security-option danger">

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

        </section>


        {/* RODAPÉ */}

        <div className="configs-footer">

          <button className="configs-save-button">

            <Save size={18} />

            Salvar alterações

          </button>

        </div>

      </section>

    </main>
  );
};

export default Configs;