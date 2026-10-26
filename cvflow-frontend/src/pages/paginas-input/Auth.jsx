import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import { apiFetch } from "../../services/api";
import { setToken } from "../../services/auth";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
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
      const dados = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailLogin,
          senha: senhaLogin,
        }),
      });
      setToken(dados.token, lembrarDeMim);
      login(dados.usuario);
      navigate("/flow");
    } catch (erro) {
      console.error("Erro ao realizar login:", erro);
      setErroLogin(erro.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErroRegistro("");
    setMensagemRegistro("");
    setCarregandoRegistro(true);
    
    if (!nomeRegistro || !emailRegistro || !senhaRegistro || !confirmarSenhaRegistro) {
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
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nome: nomeRegistro.trim(),
          email: emailRegistro.trim(),
          senha: senhaRegistro,
        }),
      });
      
      setNomeRegistro("");
      setEmailRegistro("");
      setSenhaRegistro("");
      setConfirmarSenhaRegistro("");
      setEmailLogin(emailRegistro.trim());
      setMensagemRegistro("Conta criada com sucesso! Faça login para continuar.");
      setModo("login");
    } catch (erro) {
      console.error("Erro ao realizar cadastro:", erro);
      setErroRegistro(erro.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoRegistro(false);
    }
  };

  const alternarModo = () => {
    setModo((modoAtual) => (modoAtual === "login" ? "registro" : "login"));
    setErroLogin("");
    setErroRegistro("");
    setMensagemRegistro("");
  };

  return (
    <main className={`auth-container ${modo}`}>
      <div className="auth-box">
        
        <div className="auth-forms">
          <div className="auth-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="CVFlow" />
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          <div className="auth-form login-form">
            <div className="auth-content">
              <span className="auth-badge">Bem-vindo de volta</span>
              <h1>Acesse sua conta</h1>
              <p>Continue construindo sua próxima grande oportunidade profissional.</p>
              
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
                    onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                    aria-label={mostrarSenhaLogin ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenhaLogin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div className="auth-options">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={lembrarDeMim}
                      onChange={(e) => setLembrarDeMim(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Lembrar de mim
                  </label>
                  <a href="#" className="forgot-password">Esqueci minha senha</a>
                </div>
                
                {mensagemRegistro && (
                  <div className="auth-feedback success" role="status">
                    {mensagemRegistro}
                  </div>
                )}
                
                {erroLogin && (
                  <div className="auth-feedback error" role="alert">
                    {erroLogin}
                  </div>
                )}
                
                <button
                  className="auth-button hover-lift"
                  type="submit"
                  disabled={carregandoLogin}
                >
                  {carregandoLogin ? "Entrando..." : "Entrar na plataforma"}
                  {!carregandoLogin && <ArrowRight size={18} />}
                </button>
              </form>
              
              <div className="auth-switch">
                <span>Novo por aqui?</span>
                <button type="button" onClick={alternarModo}>
                  Criar uma conta grátis
                </button>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO DE REGISTRO */}
          <div className="auth-form registro-form">
            <div className="auth-content">
              <span className="auth-badge">Comece agora</span>
              <h1>Crie sua conta</h1>
              <p>Preencha seus dados e tenha acesso a currículos profissionais ilimitados.</p>
              
              <form onSubmit={handleRegistro}>
                <div className="input-group">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={nomeRegistro}
                    onChange={(e) => setNomeRegistro(e.target.value)}
                  />
                </div>
                
                <div className="input-group">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={emailRegistro}
                    onChange={(e) => setEmailRegistro(e.target.value)}
                  />
                </div>
                
                <div className="input-group password-group">
                  <Lock size={18} />
                  <input
                    type={mostrarSenhaRegistro ? "text" : "password"}
                    placeholder="Crie uma senha forte"
                    value={senhaRegistro}
                    onChange={(e) => setSenhaRegistro(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setMostrarSenhaRegistro(!mostrarSenhaRegistro)}
                  >
                    {mostrarSenhaRegistro ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div className="input-group password-group">
                  <Lock size={18} />
                  <input
                    type={mostrarConfirmacao ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmarSenhaRegistro}
                    onChange={(e) => setConfirmarSenhaRegistro(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                  >
                    {mostrarConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {erroRegistro && (
                  <div className="auth-feedback error" role="alert">
                    {erroRegistro}
                  </div>
                )}
                
                <button
                  className="auth-button hover-lift"
                  type="submit"
                  disabled={carregandoRegistro}
                >
                  {carregandoRegistro ? "Criando conta..." : "Criar minha conta"}
                  {!carregandoRegistro && <ArrowRight size={18} />}
                </button>
              </form>
              
              <div className="auth-switch">
                <span>Já possui uma conta?</span>
                <button type="button" onClick={alternarModo}>
                  Fazer login
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PAINEL DECORATIVO (MARKETING) */}
        <div className="auth-right">
          <div className="auth-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle small"></div>
          </div>
          
          <div className="auth-message login-message">
            <div className="message-icon"><Sparkles size={24} /></div>
            <h2>O seu próximo passo <br />começa aqui.</h2>
            <p>Mais de milhares de currículos criados e oportunidades conquistadas através da nossa tecnologia.</p>
          </div>
          
          <div className="auth-message registro-message">
            <div className="message-icon"><Sparkles size={24} /></div>
            <h2>Destaque-se <br />para os recrutadores.</h2>
            <p>Templates testados no mercado, estruturação inteligente e exportação em PDF instantânea.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;