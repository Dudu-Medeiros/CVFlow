import { useEffect, useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  Save,
  CheckCircle,
  XCircle,
  X,
  CreditCard,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { usuario, atualizarUsuario } = useAuth();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
    }
  }, [usuario]);

  useEffect(() => {
    if (!mensagem && !erro) return;
    const temporizador = setTimeout(() => {
      setMensagem("");
      setErro("");
    }, 5000);
    return () => clearTimeout(temporizador);
  }, [mensagem, erro]);

  const fecharMensagem = () => {
    setMensagem("");
    setErro("");
  };

  const salvarAlteracoes = async (evento) => {
    evento.preventDefault();
    setMensagem("");
    setErro("");
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    
    if (!nomeLimpo || !emailLimpo) {
      setErro("Preencha seu nome e e-mail para continuar.");
      return;
    }
    
    setSalvando(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Sua sessão expirou. Faça login novamente.");
      }
      const resposta = await fetch("http://127.0.0.1:5000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nomeLimpo,
          email: emailLimpo,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível atualizar seu perfil.");
      }
      atualizarUsuario(dados.usuario);
      setNome(dados.usuario.nome);
      setEmail(dados.usuario.email);
      setMensagem("Suas informações foram atualizadas com sucesso!");
    } catch (erro) {
      setErro(erro.message || "Ocorreu um erro ao salvar suas informações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form className="profile-layout" onSubmit={salvarAlteracoes}>
      <Sidebar />
      <section className="profile-workspace animate-fade-in">
        <header className="profile-header">
          <div className="header-titles">
            <h1>Configurações da Conta</h1>
            <p>Gerencie suas informações pessoais e preferências do sistema.</p>
          </div>
        </header>

        <div className="profile-grid animate-slide-up">
          
          <div className="profile-column-main">
            
            <section className="settings-card glass-card">
              <div className="settings-header">
                <div className="settings-icon"><UserRound size={20} /></div>
                <div className="settings-title-group">
                  <h2>Dados Pessoais</h2>
                  <p>As informações básicas de identificação da sua conta.</p>
                </div>
              </div>
              
              <div className="settings-body">
                <div className="form-row split">
                  <div className="form-group">
                    <label htmlFor="nome">Nome Completo</label>
                    <input
                      id="nome"
                      type="text"
                      className="modern-input"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-mail de Acesso</label>
                    <input
                      id="email"
                      type="email"
                      className="modern-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="telefone">Telefone / WhatsApp</label>
                    <input
                      id="telefone"
                      type="tel"
                      className="modern-input"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-card glass-card">
              <div className="settings-header">
                <div className="settings-icon"><BriefcaseBusiness size={20} /></div>
                <div className="settings-title-group">
                  <h2>Perfil Profissional</h2>
                  <p>Estes dados agilizam a criação de novos currículos na plataforma.</p>
                </div>
              </div>
              
              <div className="settings-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cargo">Cargo Principal ou Área de Atuação</label>
                    <input
                      id="cargo"
                      type="text"
                      className="modern-input"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Ex: Desenvolvedor Front-End Sênior"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="objetivo">Resumo Profissional / Objetivo</label>
                    <textarea
                      id="objetivo"
                      className="modern-textarea"
                      value={objetivo}
                      onChange={(e) => setObjetivo(e.target.value)}
                      placeholder="Descreva brevemente suas qualificações, tempo de experiência e objetivos de carreira..."
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="profile-actions">
              {mensagem && (
                <div className="profile-notification success" role="status">
                  <CheckCircle size={20} />
                  <div className="notification-text">
                    <strong>Tudo certo!</strong>
                    <span>{mensagem}</span>
                  </div>
                  <button type="button" className="btn-close-notif" onClick={fecharMensagem} aria-label="Fechar"><X size={16} /></button>
                </div>
              )}
              
              {erro && (
                <div className="profile-notification error" role="alert">
                  <XCircle size={20} />
                  <div className="notification-text">
                    <strong>Ops, algo deu errado</strong>
                    <span>{erro}</span>
                  </div>
                  <button type="button" className="btn-close-notif" onClick={fecharMensagem} aria-label="Fechar"><X size={16} /></button>
                </div>
              )}
              
              <div className="spacer"></div>

              <button type="submit" className="btn-save-settings hover-lift" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar Alterações"}
                {!salvando && <Save size={18} />}
              </button>
            </div>
          </div>

          <div className="profile-column-side">
            <div className="plan-card-widget glass-card">
              <div className="plan-widget-header">
                <h3>Seu Plano</h3>
                <span className="plan-badge-active">Starter</span>
              </div>
              <p className="plan-widget-desc">Você está utilizando o plano gratuito. Faça um upgrade para liberar o poder do Consultor IA e currículos ilimitados.</p>
              
              <ul className="plan-widget-features">
                <li><Check size={16}/> Download PDF</li>
                <li><Check size={16}/> Templates Básicos</li>
                <li className="locked"><X size={16}/> Templates Premium</li>
                <li className="locked"><X size={16}/> Inteligência Artificial</li>
              </ul>

              <button 
                type="button" 
                className="btn-upgrade-plan hover-lift"
                onClick={() => navigate('/planos')}
              >
                Fazer Upgrade <CreditCard size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>
    </form>
  );
};

export default Profile;