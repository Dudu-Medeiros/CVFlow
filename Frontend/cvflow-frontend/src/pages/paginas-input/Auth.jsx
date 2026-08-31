import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import "./Auth.css";
import logo from "../../assets/logo-cvflow-sem-fundo.png";

const Auth = () => {
  const [modo, setModo] = useState("login");

  // Controle de visibilidade das senhas
  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
  const [mostrarSenhaRegistro, setMostrarSenhaRegistro] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const alternarModo = () => {
    setModo((modoAtual) =>
      modoAtual === "login" ? "registro" : "login"
    );
  };

  return (
    <main className={`auth-container ${modo}`}>
      <div className="auth-box">

        <div className="auth-forms">

          {/* LOGO */}
          <div className="auth-logo">
            <img src={logo} alt="CVFlow" />
          </div>

          {/* ================= LOGIN ================= */}

          <div className="auth-form login-form">
            <div className="auth-content">

              <span className="auth-badge">
                Bem-vindo de volta
              </span>

              <h1>Entre na sua conta</h1>

              <p>
                Acesse seu espaço e continue construindo seu próximo currículo.
              </p>

              <form>

                {/* E-MAIL */}
                <div className="input-group">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Seu e-mail"
                  />
                </div>

                {/* SENHA */}
                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={mostrarSenhaLogin ? "text" : "password"}
                    placeholder="Sua senha"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setMostrarSenhaLogin(!mostrarSenhaLogin)
                    }
                    aria-label={
                      mostrarSenhaLogin
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenhaLogin ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="auth-options">

                  <label>
                    <input type="checkbox" />
                    Lembrar de mim
                  </label>

                  <a href="#">
                    Esqueci minha senha
                  </a>

                </div>

                <button
                  className="auth-button"
                  type="submit"
                >
                  Entrar
                  <ArrowRight size={18} />
                </button>

              </form>

              <div className="auth-switch">

                <span>
                  Ainda não possui uma conta?
                </span>

                <button
                  type="button"
                  onClick={alternarModo}
                >
                  Criar conta
                </button>

              </div>

            </div>
          </div>

          {/* ================= REGISTRO ================= */}

          <div className="auth-form registro-form">
            <div className="auth-content">

              <span className="auth-badge">
                Comece agora
              </span>

              <h1>Crie sua conta</h1>

              <p>
                Preencha seus dados e comece a criar currículos profissionais.
              </p>

              <form>

                {/* NOME */}
                <div className="input-group">
                  <User size={18} />

                  <input
                    type="text"
                    placeholder="Nome completo"
                  />
                </div>

                {/* E-MAIL */}
                <div className="input-group">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Seu e-mail"
                  />
                </div>

                {/* CRIAR SENHA */}
                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={
                      mostrarSenhaRegistro
                        ? "text"
                        : "password"
                    }
                    placeholder="Crie uma senha"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setMostrarSenhaRegistro(
                        !mostrarSenhaRegistro
                      )
                    }
                    aria-label={
                      mostrarSenhaRegistro
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenhaRegistro ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* CONFIRMAR SENHA */}
                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirme sua senha"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setMostrarConfirmacao(
                        !mostrarConfirmacao
                      )
                    }
                    aria-label={
                      mostrarConfirmacao
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <button
                  className="auth-button"
                  type="submit"
                >
                  Criar minha conta
                  <ArrowRight size={18} />
                </button>

              </form>

              <div className="auth-switch">

                <span>
                  Já possui uma conta?
                </span>

                <button
                  type="button"
                  onClick={alternarModo}
                >
                  Entrar
                </button>

              </div>

            </div>
          </div>

        </div>

        {/* ================= LADO AZUL ================= */}

        <div className="auth-right">

          <div className="auth-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle small"></div>
          </div>

          <div className="auth-message login-message">

            <span>CVFlow</span>

            <h2>
              Seu currículo.
              <br />
              Sua melhor oportunidade.
            </h2>

            <p>
              Crie, personalize e conquiste novas oportunidades profissionais.
            </p>

          </div>

          <div className="auth-message registro-message">

            <span>CVFlow</span>

            <h2>
              Comece sua jornada.
              <br />
              Destaque seu potencial.
            </h2>

            <p>
              Transforme suas experiências em um currículo que representa você.
            </p>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Auth;