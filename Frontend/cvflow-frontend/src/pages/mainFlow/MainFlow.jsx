import {
  FileText,
  Plus,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Check,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./MainFlow.css";

const modelosDisponiveis = {
  ats: {
    nome: "ATS",
    descricao: "Modelo objetivo e compatível com sistemas de recrutamento.",
  },

  moderno: {
    nome: "Moderno",
    descricao: "Modelo visual com duas colunas para destacar suas habilidades.",
  },

  executivo: {
    nome: "Executivo",
    descricao: "Modelo elegante e organizado para uma apresentação profissional.",
  },
};

const MainFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  useEffect(() => {
    const modeloRecebido = location.state?.modeloSelecionado;

    if (modeloRecebido && modelosDisponiveis[modeloRecebido]) {
      localStorage.setItem("modeloSelecionado", modeloRecebido);
      setModeloSelecionado(modeloRecebido);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });

      return;
    }

    const modeloSalvo = localStorage.getItem("modeloSelecionado");

    if (modeloSalvo && modelosDisponiveis[modeloSalvo]) {
      setModeloSelecionado(modeloSalvo);
    }
  }, [location, navigate]);

  const modeloAtual = modelosDisponiveis[modeloSelecionado];

  const iniciarCurriculo = () => {
    const modeloSalvo =
      modeloSelecionado || localStorage.getItem("modeloSelecionado");

    if (!modeloSalvo || !modelosDisponiveis[modeloSalvo]) {
      navigate("/modelos");
      return;
    }

    localStorage.setItem("modeloSelecionado", modeloSalvo);

    navigate("/flow/criar", {
      state: {
        modeloSelecionado: modeloSalvo,
      },
    });
  };

  const nomeUsuario = usuario?.nome || "usuário";

  return (
    <main className="mainflow">
      <Sidebar />

      <section className="mainflow-content">
        <header className="mainflow-header">
          <div>
            <span className="header-greeting">Boa tarde 👋</span>

            <h1>Olá, {nomeUsuario}!</h1>

            <p>Vamos construir seu próximo currículo?</p>
          </div>

          <button className="profile-button">
            <div className="profile-avatar">
              {nomeUsuario.charAt(0).toUpperCase()}
            </div>

            <span>{nomeUsuario}</span>

            <ChevronRight size={17} />
          </button>
        </header>

        {modeloAtual && (
          <section className="selected-model-card">
            <div className="selected-model-icon">
              <Check size={20} />
            </div>

            <div className="selected-model-content">
              <span>Modelo selecionado</span>

              <strong>{modeloAtual.nome}</strong>

              <p>{modeloAtual.descricao}</p>
            </div>

            <button
              className="change-model-button"
              onClick={() => navigate("/modelos")}
            >
              Alterar modelo
            </button>
          </section>
        )}

        <section className="create-card">
          <div className="create-card-content">
            <span className="create-badge">
              <FileText size={15} />
              Seu próximo passo
            </span>

            <h2>
              Crie um currículo que
              <span> destaque você.</span>
            </h2>

            <p>
              Organize suas experiências, habilidades e objetivos
              profissionais em um currículo moderno e profissional.
            </p>

            <button
              className="primary-button"
              onClick={iniciarCurriculo}
            >
              <Plus size={19} />
              Criar novo currículo
            </button>
          </div>

          <div className="create-card-decoration">
            <FileText size={150} strokeWidth={0.7} />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FileText size={20} />
            </div>

            <div>
              <span>Currículos criados</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Currículos completos</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Última atividade</span>
              <strong>Nenhuma</strong>
            </div>
          </div>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <div>
              <h2>Seus currículos</h2>

              <p>Acompanhe e continue seus currículos.</p>
            </div>

            <button className="view-all">
              Ver todos
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={28} />
            </div>

            <h3>Você ainda não criou nenhum currículo</h3>

            <p>
              Comece agora e crie seu primeiro currículo profissional
              com o CVFlow.
            </p>

            <button
              className="secondary-button"
              onClick={iniciarCurriculo}
            >
              <Plus size={17} />
              Criar currículo
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default MainFlow;