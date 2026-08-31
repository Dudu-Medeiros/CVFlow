import {
  UserRound,
  BriefcaseBusiness,
  Mail,
  Phone,
  Target,
  Save,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css";

const Profile = () => {
  return (
    <main className="profile-page">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <section className="profile-content">

        {/* CABEÇALHO */}
        <header className="profile-header">

          <div>
            <h1>Meu perfil</h1>

            <p>
              Gerencie suas informações pessoais e profissionais.
            </p>
          </div>

        </header>


        {/* INFORMAÇÕES PESSOAIS */}
        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h2>Informações pessoais</h2>

              <p>
                Atualize seus dados pessoais.
              </p>
            </div>

          </div>


          <div className="profile-divider" />


          <div className="profile-form-grid">

            {/* NOME */}
            <div className="profile-field">

              <label>Nome completo</label>

              <div className="profile-input">

                <UserRound size={17} />

                <input
                  type="text"
                  defaultValue="Eduardo"
                  placeholder="Digite seu nome completo"
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="profile-field">

              <label>E-mail</label>

              <div className="profile-input">

                <Mail size={17} />

                <input
                  type="email"
                  defaultValue="eduardo@email.com"
                  placeholder="Digite seu e-mail"
                />

              </div>

            </div>


            {/* TELEFONE */}
            <div className="profile-field">

              <label>Telefone</label>

              <div className="profile-input">

                <Phone size={17} />

                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                />

              </div>

            </div>

          </div>

        </section>


        {/* INFORMAÇÕES PROFISSIONAIS */}
        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h2>Informações profissionais</h2>

              <p>
                Essas informações ajudam na criação dos seus currículos.
              </p>
            </div>

          </div>


          <div className="profile-divider" />


          <div className="profile-professional-form">

            {/* CARGO */}
            <div className="profile-field">

              <label>Cargo ou área profissional</label>

              <div className="profile-input">

                <BriefcaseBusiness size={17} />

                <input
                  type="text"
                  defaultValue="Desenvolvedor Front-End"
                  placeholder="Ex: Desenvolvedor Front-End"
                />

              </div>

            </div>


            {/* OBJETIVO */}
            <div className="profile-field">

              <label>Objetivo profissional</label>

              <div className="profile-textarea">

                <Target size={17} />

                <textarea
                  placeholder="Descreva brevemente seus objetivos profissionais..."
                />

              </div>

            </div>

          </div>

        </section>


        {/* BOTÃO */}
        <div className="profile-actions">

          <button className="profile-save-button">

            <Save size={17} />

            Salvar alterações

          </button>

        </div>

      </section>

    </main>
  );
};

export default Profile;