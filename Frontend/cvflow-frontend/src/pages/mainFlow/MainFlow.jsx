import {
  FileText,
  Plus,
  ChevronRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";

import "./MainFlow.css";

const MainFlow = () => {
  return (
    <main className="mainflow">

      {/* SIDEBAR */}
      <Sidebar />


      {/* CONTEÚDO PRINCIPAL */}
      <section className="mainflow-content">

        {/* HEADER */}
        <header className="mainflow-header">

          <div>
            <span className="header-greeting">
              Boa tarde 👋
            </span>

            <h1>
              Olá, Eduardo!
            </h1>

            <p>
              Vamos construir seu próximo currículo?
            </p>
          </div>


          <button className="profile-button">

            <div className="profile-avatar">
              E
            </div>

            <span>
              Eduardo
            </span>

            <ChevronRight size={17} />

          </button>

        </header>


        {/* CARD PRINCIPAL */}
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


            <button className="primary-button">

              <Plus size={19} />

              Criar novo currículo

            </button>

          </div>


          <div className="create-card-decoration">

            <FileText
              size={150}
              strokeWidth={0.7}
            />

          </div>

        </section>


        {/* ESTATÍSTICAS */}
        <section className="stats-grid">


          {/* CURRÍCULOS CRIADOS */}
          <div className="stat-card">

            <div className="stat-icon blue">
              <FileText size={20} />
            </div>

            <div>

              <span>
                Currículos criados
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>


          {/* CURRÍCULOS COMPLETOS */}
          <div className="stat-card">

            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>

              <span>
                Currículos completos
              </span>

              <strong>
                0
              </strong>

            </div>

          </div>


          {/* ÚLTIMA ATIVIDADE */}
          <div className="stat-card">

            <div className="stat-icon purple">
              <Clock3 size={20} />
            </div>

            <div>

              <span>
                Última atividade
              </span>

              <strong>
                Nenhuma
              </strong>

            </div>

          </div>

        </section>


        {/* CURRÍCULOS RECENTES */}
        <section className="recent-section">

          <div className="section-header">

            <div>

              <h2>
                Seus currículos
              </h2>

              <p>
                Acompanhe e continue seus currículos.
              </p>

            </div>


            <button className="view-all">

              Ver todos

              <ChevronRight size={16} />

            </button>

          </div>


          {/* ESTADO VAZIO */}
          <div className="empty-state">

            <div className="empty-icon">

              <FileText size={28} />

            </div>


            <h3>
              Você ainda não criou nenhum currículo
            </h3>


            <p>
              Comece agora e crie seu primeiro currículo
              profissional com o CVFlow.
            </p>


            <button className="secondary-button">

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