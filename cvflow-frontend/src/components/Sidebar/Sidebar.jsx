import {
  LayoutDashboard,
  FileText,
  UserRound,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/logo-cvflow-sem-fundo.png";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  
  const nomeCompleto = usuario?.nome?.trim() || "Usuário";
  const partesNome = nomeCompleto.split(/\s+/);
  const nomeExibicao = partesNome.length > 1
    ? `${partesNome[0]} ${partesNome[partesNome.length - 1]}`
    : partesNome[0];
    
  const inicial = nomeCompleto.charAt(0).toUpperCase();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <aside className="premium-sidebar-container">
      <div className="sidebar-inner-glass">
        
        <div className="sidebar-brand" onClick={() => navigate("/")}>
          <img src={logo} alt="CVFlow" className="brand-logo" />
        </div>
        
        <div className="sidebar-scroll-area">
          <nav className="sidebar-nav-menu">
            <span className="nav-group-label">Visão Geral</span>
            
            <button className={`nav-button ${isActive("/flow")}`} onClick={() => navigate("/flow")}>
              <div className="nav-icon"><LayoutDashboard size={20} /></div>
              <span className="nav-text">Dashboard</span>
            </button>
            
            <button className={`nav-button ${isActive("/curriculos")}`} onClick={() => navigate("/curriculos")}>
              <div className="nav-icon"><FileText size={20} /></div>
              <span className="nav-text">Galeria</span>
            </button>
            
            <button className={`nav-button ${isActive("/perfil")}`} onClick={() => navigate("/perfil")}>
              <div className="nav-icon"><UserRound size={20} /></div>
              <span className="nav-text">Minha Conta</span>
            </button>

            <span className="nav-group-label mt-4">Sistema</span>
            
            <button className={`nav-button ${isActive("/configuracoes")}`} onClick={() => navigate("/configuracoes")}>
              <div className="nav-icon"><Settings size={20} /></div>
              <span className="nav-text">Preferências</span>
            </button>

            {/* BOTÃO DE SAIR EXCLUSIVO PARA O MOBILE */}
            <button className="nav-button mobile-only-logout text-danger" onClick={logout}>
              <div className="nav-icon"><LogOut size={20} /></div>
              <span className="nav-text">Sair</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          {/* NOVO: CARD DE PLANOS (UPSELL) */}
          <div className="sidebar-upsell-card" onClick={() => navigate("/planos")}>
            <div className="upsell-icon"><Sparkles size={18} /></div>
            <div className="upsell-info">
              <strong>Fazer Upgrade</strong>
              <span>Conheça os planos</span>
            </div>
          </div>

          <div className="user-profile-dock">
            <div className="user-avatar">{inicial}</div>
            <div className="user-details">
              <strong>{nomeExibicao}</strong>
              <span>Plano Starter</span>
            </div>
          </div>
          
          <button className="btn-logout-desktop-clear" onClick={logout}>
            <LogOut size={18} /> Sair da conta
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;