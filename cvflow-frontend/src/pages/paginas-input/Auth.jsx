import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import { apiFetch } from "../../services/api";
import { setToken } from "../../services/auth";
import { useGoogleLogin } from '@react-oauth/google';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Key
} from "lucide-react";
import "./Auth.css";
import logo from "../../assets/logo-cvflow-sem-fundo.png";

const Auth = () => {
  const [modo, setModo] = useState("login");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedinProcessado = useRef(false);
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

  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [erroVerificacao, setErroVerificacao] = useState("");
  const [carregandoVerificacao, setCarregandoVerificacao] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state === "cvflow_seguranca" && !linkedinProcessado.current) {
      linkedinProcessado.current = true;
      setSearchParams({});
      processarLoginLinkedIn(code);
    }
  }, [searchParams, setSearchParams]);

  const processarLoginLinkedIn = async (code) => {
    setCarregandoLogin(true);
    setErroLogin("");
    try {
      const dados = await apiFetch("/auth/linkedin", {
        method: "POST",
        body: JSON.stringify({ code: code, redirect_uri: "http://localhost:5173/auth" }),
      });
      setToken(dados.token, true);
      login(dados.usuario);
      navigate("/flow");
    } catch (erro) {
      setErroLogin(erro.message || "Falha ao autenticar com o LinkedIn.");
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setCarregandoLogin(true);
        setErroLogin("");
        const dados = await apiFetch("/auth/google", {
          method: "POST",
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        setToken(dados.token, true);
        login(dados.usuario);
        navigate("/flow");
      } catch (erro) {
        setErroLogin(erro.message || "Erro ao conectar com o Google.");
      } finally {
        setCarregandoLogin(false);
      }
    },
    onError: () => setErroLogin("A autenticação com o Google falhou."),
  });

  const handleLinkedInAuth = () => {
    const clientId = "77f4vq0kdutmmm";
    const redirectUri = encodeURIComponent("http://localhost:5173/auth");
    const state = "cvflow_seguranca";
    const scope = encodeURIComponent("openid profile email");
    const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    window.location.href = linkedinUrl;
  };

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
        body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });
      setToken(dados.token, lembrarDeMim);
      login(dados.usuario);
      navigate("/flow");
    } catch (erro) {
      setErroLogin(erro.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErroRegistro("");
    setCarregandoRegistro(true);
    
    if (!nomeRegistro || !emailRegistro || !senhaRegistro || !confirmarSenhaRegistro) {
      setErroRegistro("Preencha todos os campos.");
      setCarregandoRegistro(false);
      return;
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexSenha.test(senhaRegistro)) {
      setErroRegistro("A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos (@$!%*?&).");
      setCarregandoRegistro(false);
      return;
    }

    if (senhaRegistro !== confirmarSenhaRegistro) {
      setErroRegistro("As senhas não coincidem.");
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
      
      setModo("verificacao");
    } catch (erro) {
      setErroRegistro(erro.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoRegistro(false);
    }
  };

  const handleVerificacao = async (e) => {
    e.preventDefault();
    setErroVerificacao("");
    setCarregandoVerificacao(true);

    if (!codigoVerificacao) {
      setErroVerificacao("Digite o código recebido.");
      setCarregandoVerificacao(false);
      return;
    }

    try {
      await apiFetch("/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({
          email: emailRegistro.trim(),
          codigo: codigoVerificacao.trim()
        }),
      });
      
      setNomeRegistro(""); setSenhaRegistro(""); setConfirmarSenhaRegistro(""); setCodigoVerificacao("");
      setEmailLogin(emailRegistro.trim());
      setMensagemRegistro("Conta ativada com sucesso! Faça login para continuar.");
      setModo("login");
    } catch (erro) {
      setErroVerificacao(erro.message || "Código inválido ou expirado.");
    } finally {
      setCarregandoVerificacao(false);
    }
  };

  const alternarModo = () => {
    setModo((modoAtual) => (modoAtual === "login" ? "registro" : "login"));
    setErroLogin(""); setErroRegistro(""); setErroVerificacao(""); setMensagemRegistro("");
  };

  return (
    <main className={`auth-container ${modo}`}>
      <div className="auth-box">
        
        <div className="auth-forms">
          <div className="auth-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="CVFlow" />
          </div>

          {modo === "login" && (
            <div className="auth-form login-form">
              <div className="auth-content">
                <span className="auth-badge">Bem-vindo de volta</span>
                <h1>Acesse sua conta</h1>
                <p>Continue construindo sua próxima grande oportunidade profissional.</p>
                
                <div className="social-auth-container">
                  <button className="btn-social" onClick={() => handleGoogleAuth()} type="button">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button className="btn-social" onClick={handleLinkedInAuth} type="button">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>

                <div className="auth-divider">
                  <span>ou acesse com e-mail</span>
                </div>
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
                    >
                      {mostrarSenhaLogin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <div className="auth-options">
                    <label className="checkbox-container">
                      <input type="checkbox" checked={lembrarDeMim} onChange={(e) => setLembrarDeMim(e.target.checked)} />
                      <span className="checkmark"></span> Lembrar de mim
                    </label>
                    <a href="#" className="forgot-password">Esqueci minha senha</a>
                  </div>
                  
                  {mensagemRegistro && <div className="auth-feedback success">{mensagemRegistro}</div>}
                  {erroLogin && <div className="auth-feedback error">{erroLogin}</div>}
                  
                  <button className="auth-button hover-lift" type="submit" disabled={carregandoLogin}>
                    {carregandoLogin ? "Entrando..." : "Entrar na plataforma"}
                    {!carregandoLogin && <ArrowRight size={18} />}
                  </button>
                </form>
                
                <div className="auth-switch">
                  <span>Novo por aqui?</span>
                  <button type="button" onClick={alternarModo}>Criar uma conta grátis</button>
                </div>
              </div>
            </div>
          )}

          {modo === "registro" && (
            <div className="auth-form registro-form">
              <div className="auth-content">
                <span className="auth-badge">Comece agora</span>
                <h1>Crie sua conta</h1>
                <p>Preencha seus dados e tenha acesso a currículos profissionais ilimitados.</p>
                
                <form onSubmit={handleRegistro}>
                  <div className="input-group">
                    <User size={18} />
                    <input type="text" placeholder="Nome completo" value={nomeRegistro} onChange={(e) => setNomeRegistro(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <Mail size={18} />
                    <input type="email" placeholder="Seu melhor e-mail" value={emailRegistro} onChange={(e) => setEmailRegistro(e.target.value)} />
                  </div>
                  
                  <div className="input-group password-group">
                    <Lock size={18} />
                    <input type={mostrarSenhaRegistro ? "text" : "password"} placeholder="Crie uma senha forte" value={senhaRegistro} onChange={(e) => setSenhaRegistro(e.target.value)} />
                    <button type="button" className="password-toggle" onClick={() => setMostrarSenhaRegistro(!mostrarSenhaRegistro)}>
                      {mostrarSenhaRegistro ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <div className="input-group password-group">
                    <Lock size={18} />
                    <input type={mostrarConfirmacao ? "text" : "password"} placeholder="Confirme sua senha" value={confirmarSenhaRegistro} onChange={(e) => setConfirmarSenhaRegistro(e.target.value)} />
                    <button type="button" className="password-toggle" onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}>
                      {mostrarConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {erroRegistro && <div className="auth-feedback error">{erroRegistro}</div>}
                  
                  <button className="auth-button hover-lift" type="submit" disabled={carregandoRegistro}>
                    {carregandoRegistro ? "Criando conta..." : "Criar minha conta"}
                    {!carregandoRegistro && <ArrowRight size={18} />}
                  </button>
                </form>
                
                <div className="auth-switch">
                  <span>Já possui uma conta?</span>
                  <button type="button" onClick={alternarModo}>Fazer login</button>
                </div>
              </div>
            </div>
          )}

          {modo === "verificacao" && (
            <div className="auth-form verificacao-form">
              <div className="auth-content">
                <span className="auth-badge">Segurança</span>
                <h1>Verifique seu e-mail</h1>
                <p>Enviamos um código de 6 dígitos para <strong>{emailRegistro}</strong>. Insira-o abaixo para ativar sua conta.</p>
                
                <form onSubmit={handleVerificacao}>
                  <div className="input-group">
                    <Key size={18} />
                    <input 
                      type="text" 
                      placeholder="000000" 
                      maxLength="6"
                      value={codigoVerificacao} 
                      onChange={(e) => setCodigoVerificacao(e.target.value.replace(/\D/g, ''))} 
                      style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                    />
                  </div>
                  
                  {erroVerificacao && <div className="auth-feedback error">{erroVerificacao}</div>}
                  
                  <button className="auth-button hover-lift" type="submit" disabled={carregandoVerificacao}>
                    {carregandoVerificacao ? "Verificando..." : "Confirmar código"}
                    {!carregandoVerificacao && <ArrowRight size={18} />}
                  </button>
                </form>
                
                <div className="auth-switch">
                  <span>Digitou o e-mail errado?</span>
                  <button type="button" onClick={() => setModo("registro")}>Voltar para o cadastro</button>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="auth-right">
          <div className="auth-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle small"></div>
          </div>
          
          <div className="auth-message">
            <div className="message-icon"><Sparkles size={24} /></div>
            <h2>O seu próximo passo <br />começa aqui.</h2>
            <p>Milhares de currículos criados e oportunidades conquistadas através da nossa tecnologia.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;