import {
  LayoutDashboard,
  FileText,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Sidebar.css";

import logo from "../../assets/logo-cvflow-sem-fundo.png";

const Sidebar = () => {

  const navigate = useNavigate();

  return (
    <aside className="mainflow-sidebar">

      <div className="sidebar-logo">
        <img src={logo} alt="CVFlow" />
      </div>

      <nav className="sidebar-nav">

        <span className="nav-title">
          MENU
        </span>

        <button
          className="sidebar-item"
          onClick={() => navigate("/flow")}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </button>

        <button
          className="sidebar-item"
          onClick={() => navigate("/curriculos")}
        >
          <FileText size={19} />
          <span>Meus currículos</span>
        </button>

        <button className="sidebar-item"
         onClick={() => navigate("/perfil")}>
          <UserRound size={19} />
          <span>Meu perfil</span>
        </button>

        <span className="nav-title sidebar-settings-title">
          CONFIGURAÇÕES
        </span>

        <button className="sidebar-item"
         onClick={() => navigate("/configuracoes")}>
          <Settings size={19} />
          <span>Configurações</span>
        </button>

      </nav>

      <div className="sidebar-bottom">

        <button className="sidebar-item logout">
          <LogOut size={19} />
          <span>Sair</span>
        </button>

        <div className="sidebar-user">

          <div className="user-avatar">
            E
          </div>

          <div className="user-info">
            <strong>Eduardo</strong>
            <span>Minha conta</span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;