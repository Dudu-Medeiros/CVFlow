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
import { getToken } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
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
        const [respostaCurriculos, respostaConfiguracoes] = await Promise.all([
          fetch(`${API_URL}/curriculos`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/auth/settings`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const dadosCurriculos = await respostaCurriculos.json();
        const dadosConfiguracoes = await respostaConfiguracoes.json();

        if (!respostaCurriculos.ok) throw new Error(dadosCurriculos.erro || "Não foi possível carregar seus currículos.");
        if (!respostaConfiguracoes.ok) throw new Error(dadosConfiguracoes.erro || "Não foi possível carregar suas configurações.");

        setCurriculos(
          Array.isArray(dadosCurriculos)
            ? dadosCurriculos
            : Array.isArray(dadosCurriculos.curriculos)
            ? dadosCurriculos.curriculos
            : []
        );

        const configuracoes = dadosConfiguracoes.configuracoes || {};
        setCurriculoPrincipal(configuracoes.curriculo_principal_id ? String(configuracoes.curriculo_principal_id) : "");
        setFormatoPadrao(configuracoes.formato_padrao || "pdf");
      } catch (error) {
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
      const resposta = await fetch(`${API_URL}/auth/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curriculo_principal_id: curriculoPrincipal ? Number(curriculoPrincipal) : null,
          formato_padrao: formatoPadrao,
        }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível salvar as configurações.");
      
      setMensagem(dados.mensagem || "Configurações salvas com sucesso!");
      setTimeout(() => setMensagem(""), 4000);
    } catch (error) {
      setErro(error.message);
      setTimeout(() => setErro(""), 4000);
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
        setErroSenha("Preencha todos os campos.");
        return;
      }
      if (novaSenha.length < 6) {
        setErroSenha("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (novaSenha !== confirmarSenha) {
        setErroSenha("A confirmação da nova senha não coincide.");
        return;
      }
      
      setAlterandoSenha(true);
      const token = getToken();
      const resposta = await fetch(`${API_URL}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível alterar a senha.");
      
      setMensagemSenha(dados.mensagem || "Senha alterada com sucesso!");
      setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
      setTimeout(() => setMostrarSenha(false), 2000);
    } catch (error) {
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
      const resposta = await fetch(`${API_URL}/auth/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível excluir a conta.");
      
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      logout();
    } catch (error) {
      setErro(error.message);
    } finally {
      setExcluindo(false);
      setMostrarConfirmacao(false);
    }
  };

  return (
    <main className="configs-layout">
      <Sidebar />
      <section className="configs-workspace animate-fade-in">
        <header className="configs-header">
          <div className="header-titles">
            <h1>Sistema</h1>
            <p>Ajuste preferências de uso e controle o acesso à sua conta.</p>
          </div>
        </header>

        <div className="configs-grid animate-slide-up">
          <div className="configs-column-main">
            
            <section className="settings-card glass-card">
              <div className="settings-header">
                <div className="settings-icon"><Star size={20} /></div>
                <div className="settings-title-group">
                  <h2>Preferências</h2>
                  <p>Configure como o sistema gerencia seus arquivos.</p>
                </div>
              </div>
              
              <div className="settings-body">
                {carregando ? (
                  <p className="loading-text">Carregando configurações...</p>
                ) : (
                  <>
                    <div className="config-row">
                      <div className="config-info">
                        <strong>Currículo Principal</strong>
                        <span>O documento padrão ao compartilhar seu perfil.</span>
                      </div>
                      <select 
                        className="modern-select" 
                        value={curriculoPrincipal} 
                        onChange={(e) => setCurriculoPrincipal(e.target.value)}
                      >
                        <option value="">Nenhum selecionado</option>
                        {curriculos.map((c) => (
                          <option key={c.id} value={c.id}>{c.titulo || 'Currículo sem título'}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="config-divider"></div>
                    
                    <div className="config-row">
                      <div className="config-info">
                        <strong>Formato de Exportação</strong>
                        <span>Formato padrão ao baixar seus documentos.</span>
                      </div>
                      <select 
                        className="modern-select" 
                        value={formatoPadrao} 
                        onChange={(e) => setFormatoPadrao(e.target.value)}
                      >
                        <option value="pdf">PDF (.pdf)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="settings-card glass-card">
              <div className="settings-header">
                <div className="settings-icon danger-icon-bg"><Shield size={20} /></div>
                <div className="settings-title-group">
                  <h2>Segurança</h2>
                  <p>Proteja e gerencie o acesso aos seus dados.</p>
                </div>
              </div>
              
              <div className="settings-body no-padding-bottom">
                <button className="security-row hover-bg" onClick={abrirModalSenha}>
                  <div className="security-info">
                    <div className="sec-icon"><Lock size={18} /></div>
                    <div className="sec-texts">
                      <strong>Alterar Senha</strong>
                      <span>Atualize sua credencial de acesso.</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="sec-arrow" />
                </button>
                
                <div className="config-divider m-0"></div>
                
                <button className="security-row hover-bg" onClick={() => setMostrarConfirmacao(true)}>
                  <div className="security-info danger-zone">
                    <div className="sec-icon danger-icon"><Trash2 size={18} /></div>
                    <div className="sec-texts">
                      <strong>Excluir Conta</strong>
                      <span>Apague todos os seus dados permanentemente.</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="sec-arrow danger-arrow" />
                </button>
              </div>
            </section>

            <div className="configs-actions">
              {mensagem && <div className="status-feedback success">{mensagem}</div>}
              {erro && <div className="status-feedback error">{erro}</div>}
              
              <div className="spacer"></div>
              
              <button className="btn-save-settings hover-lift" onClick={salvarConfiguracoes} disabled={carregando || salvando}>
                {salvando ? "Salvando..." : "Salvar Configurações"}
                {!salvando && <Save size={18} />}
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Modal de Senha */}
      {mostrarSenha && (
        <div className="modal-backdrop" onMouseDown={(e) => { if(e.target === e.currentTarget) setMostrarSenha(false) }}>
          <div className="modal-panel zoom-in" role="dialog">
            <button className="btn-close-modal" onClick={() => setMostrarSenha(false)}><X size={20} /></button>
            <div className="modal-content">
              <div className="modal-icon-header"><Lock size={28} /></div>
              <h2>Alterar Senha</h2>
              <p>Atualize a segurança da sua conta.</p>
              
              <div className="password-form-group">
                <label>Senha Atual</label>
                <input type="password" placeholder="Sua senha atual" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
                
                <label className="mt-3">Nova Senha</label>
                <input type="password" placeholder="Pelo menos 6 caracteres" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                
                <label className="mt-3">Confirme a Nova Senha</label>
                <input type="password" placeholder="Repita a nova senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              </div>

              {erroSenha && <div className="status-feedback error mb-3">{erroSenha}</div>}
              {mensagemSenha && <div className="status-feedback success mb-3">{mensagemSenha}</div>}

              <div className="modal-actions-row">
                <button className="btn-modal-outline" onClick={() => setMostrarSenha(false)}>Cancelar</button>
                <button className="btn-modal-solid" onClick={alterarSenha} disabled={alterandoSenha}>
                  {alterandoSenha ? "Alterando..." : "Confirmar Alteração"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {mostrarConfirmacao && (
        <div className="modal-backdrop" onMouseDown={(e) => { if(e.target === e.currentTarget) setMostrarConfirmacao(false) }}>
          <div className="modal-panel zoom-in" role="dialog">
            <button className="btn-close-modal" onClick={() => setMostrarConfirmacao(false)}><X size={20} /></button>
            <div className="modal-content text-center">
              <div className="modal-icon-header danger-icon-bg"><AlertTriangle size={28} className="danger-text" /></div>
              <h2>Excluir Conta?</h2>
              <p>Esta ação é permanente e todos os seus currículos serão apagados. <strong>Não é possível desfazer.</strong></p>
              
              <div className="modal-actions-row">
                <button className="btn-modal-outline" onClick={() => setMostrarConfirmacao(false)} disabled={excluindo}>Cancelar</button>
                <button className="btn-modal-solid danger-btn" onClick={excluirConta} disabled={excluindo}>
                  {excluindo ? "Apagando..." : "Sim, excluir minha conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Configs;