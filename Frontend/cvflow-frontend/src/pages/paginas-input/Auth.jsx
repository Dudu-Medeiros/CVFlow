import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
  const [mostrarSenhaRegistro, setMostrarSenhaRegistro] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  const [lembrarDeMim, setLembrarDeMim] = useState(false);

  const [erroLogin, setErroLogin] = useState("");
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const [nomeRegistro, setNomeRegistro] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [senhaRegistro, setSenhaRegistro] = useState("");
  const [confirmarSenhaRegistro, setConfirmarSenhaRegistro] = useState("");

  const [erroRegistro, setErroRegistro] = useState("");
  const [carregandoRegistro, setCarregandoRegistro] = useState(false);
  const [mensagemRegistro, setMensagemRegistro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setErroLogin("");
    setCarregandoLogin(true);

    if (!emailLogin || !senhaLogin) {
      setErroLogin("Preencha todos os campos.");
      setCarregandoLogin(false);
      return;
    }

    try {
      const resposta = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLogin,
          senha: senhaLogin,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroLogin(dados.erro || "Erro ao realizar login.");
        return;
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (lembrarDeMim) {
        localStorage.setItem("token", dados.token);
      } else {
        sessionStorage.setItem("token", dados.token);
      }

      login(dados.usuario);
      navigate("/flow");
    } catch (erro) {
      console.error("Erro ao realizar login:", erro);
      setErroLogin("Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    setErroRegistro("");
    setMensagemRegistro("");
    setCarregandoRegistro(true);

    if (
      !nomeRegistro ||
      !emailRegistro ||
      !senhaRegistro ||
      !confirmarSenhaRegistro
    ) {
      setErroRegistro("Preencha todos os campos.");
      setCarregandoRegistro(false);
      return;
    }

    if (senhaRegistro !== confirmarSenhaRegistro) {
      setErroRegistro("As senhas não coincidem.");
      setCarregandoRegistro(false);
      return;
    }

    if (senhaRegistro.length < 6) {
      setErroRegistro("A senha deve possuir pelo menos 6 caracteres.");
      setCarregandoRegistro(false);
      return;
    }

    try {
      const resposta = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeRegistro.trim(),
          email: emailRegistro.trim(),
          senha: senhaRegistro,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroRegistro(dados.erro || "Erro ao realizar cadastro.");
        return;
      }

      setNomeRegistro("");
      setEmailRegistro("");
      setSenhaRegistro("");
      setConfirmarSenhaRegistro("");

      setEmailLogin(emailRegistro);
      setMensagemRegistro(
        "Conta criada com sucesso! Agora faça login para continuar."
      );

      setModo("login");
    } catch (erro) {
      console.error("Erro ao realizar cadastro:", erro);
      setErroRegistro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoRegistro(false);
    }
  };

  const alternarModo = () => {
    setModo((modoAtual) =>
      modoAtual === "login" ? "registro" : "login"
    );

    setErroLogin("");
    setErroRegistro("");
    setMensagemRegistro("");
  };

  return (
    <main className={`auth-container ${modo}`}>
      <div className="auth-box">
        <div className="auth-forms">
          <div className="auth-logo">
            <img src={logo} alt="CVFlow" />
          </div>

          <div className="auth-form login-form">
            <div className="auth-content">
              <span className="auth-badge">
                Bem-vindo de volta
              </span>

              <h1>Entre na sua conta</h1>

              <p>
                Acesse seu espaço e continue construindo seu próximo currículo.
              </p>

              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                  />
                </div>

                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={mostrarSenhaLogin ? "text" : "password"}
                    placeholder="Sua senha"
                    value={senhaLogin}
                    onChange={(e) => setSenhaLogin(e.target.value)}
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
                    <input
                      type="checkbox"
                      checked={lembrarDeMim}
                      onChange={(e) =>
                        setLembrarDeMim(e.target.checked)
                      }
                    />
                    Lembrar de mim
                  </label>

                  <a href="#">
                    Esqueci minha senha
                  </a>
                </div>

                {mensagemRegistro && (
                  <p className="auth-success" role="status">
                    {mensagemRegistro}
                  </p>
                )}

                {erroLogin && (
                  <p className="auth-error" role="alert">
                    {erroLogin}
                  </p>
                )}

                <button
                  className="auth-button"
                  type="submit"
                  disabled={carregandoLogin}
                  aria-busy={carregandoLogin}
                >
                  {carregandoLogin ? "Entrando..." : "Entrar"}
                  {!carregandoLogin && <ArrowRight size={18} />}
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

          <div className="auth-form registro-form">
            <div className="auth-content">
              <span className="auth-badge">
                Comece agora
              </span>

              <h1>Crie sua conta</h1>

              <p>
                Preencha seus dados e comece a criar currículos profissionais.
              </p>

              <form onSubmit={handleRegistro}>
                <div className="input-group">
                  <User size={18} />

                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={nomeRegistro}
                    onChange={(e) =>
                      setNomeRegistro(e.target.value)
                    }
                  />
                </div>

                <div className="input-group">
                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={emailRegistro}
                    onChange={(e) =>
                      setEmailRegistro(e.target.value)
                    }
                  />
                </div>

                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={
                      mostrarSenhaRegistro
                        ? "text"
                        : "password"
                    }
                    placeholder="Crie uma senha"
                    value={senhaRegistro}
                    onChange={(e) =>
                      setSenhaRegistro(e.target.value)
                    }
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

                <div className="input-group password-group">
                  <Lock size={18} />

                  <input
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirme sua senha"
                    value={confirmarSenhaRegistro}
                    onChange={(e) =>
                      setConfirmarSenhaRegistro(e.target.value)
                    }
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

                {erroRegistro && (
                  <p className="auth-error" role="alert">
                    {erroRegistro}
                  </p>
                )}

                <button
                  className="auth-button"
                  type="submit"
                  disabled={carregandoRegistro}
                  aria-busy={carregandoRegistro}
                >
                  {carregandoRegistro
                    ? "Criando conta..."
                    : "Criar minha conta"}

                  {!carregandoRegistro && (
                    <ArrowRight size={18} />
                  )}
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