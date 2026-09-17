import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Clock3,
  Search,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./CurriculoMain.css";

const CurriculoMain = () => {
  const navigate = useNavigate();

  const curriculos = [
    {
      id: 1,
      titulo: "Currículo Profissional",
      cargo: "Desenvolvedor Front-End",
      atualizado: "Atualizado há 2 dias",
      status: "Completo",
    },
    {
      id: 2,
      titulo: "Currículo - Estágio",
      cargo: "Estágio em Desenvolvimento",
      atualizado: "Atualizado há 5 dias",
      status: "Completo",
    },
  ];

  return (
    <main className="curriculos-layout">
      <Sidebar />

      <section className="curriculos-page">
        <header className="curriculos-header">
          <div>
            <span className="curriculos-badge">
              <FileText size={14} />
              Meus documentos
            </span>

            <h1>Meus currículos</h1>

            <p>
              Gerencie seus currículos e mantenha suas informações
              profissionais sempre atualizadas.
            </p>
          </div>

          <button
            className="novo-curriculo-button"
            onClick={() => navigate("/novo-curriculo")}
          >
            <Plus size={19} />
            Novo currículo
          </button>
        </header>

        <section className="curriculos-toolbar">
          <div className="curriculos-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar currículo..."
            />
          </div>

          <span className="curriculos-count">
            {curriculos.length} currículos
          </span>
        </section>

        <section className="curriculos-list">
          {curriculos.map((curriculo) => (
            <article className="curriculo-card" key={curriculo.id}>
              <div className="curriculo-icon">
                <FileText size={25} />
              </div>

              <div className="curriculo-info">
                <h2>{curriculo.titulo}</h2>

                <p className="curriculo-cargo">{curriculo.cargo}</p>

                <div className="curriculo-meta">
                  <span>
                    <Clock3 size={14} />
                    {curriculo.atualizado}
                  </span>

                  <span className="curriculo-status">
                    {curriculo.status}
                  </span>
                </div>
              </div>

              <div className="curriculo-actions">
                <button
                  className="curriculo-action"
                  title="Editar currículo"
                >
                  <Pencil size={17} />
                </button>

                <button
                  className="curriculo-action"
                  title="Baixar currículo"
                >
                  <Download size={17} />
                </button>

                <button
                  className="curriculo-action danger"
                  title="Excluir currículo"
                >
                  <Trash2 size={17} />
                </button>

                <button
                  className="curriculo-more"
                  title="Mais opções"
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>
            </article>
          ))}

          {curriculos.length === 0 && (
            <div className="curriculos-empty">
              <div className="empty-icon">
                <FileText size={30} />
              </div>

              <h2>Você ainda não possui currículos</h2>

              <p>
                Crie seu primeiro currículo e comece a construir
                novas oportunidades profissionais.
              </p>

              <button
                className="novo-curriculo-button"
                onClick={() => navigate("/novo-curriculo")}
              >
                <Plus size={18} />
                Criar meu primeiro currículo
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default CurriculoMain;