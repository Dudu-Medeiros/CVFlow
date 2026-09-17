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
      <Sidebar />

      <section className="profile-content">
        <header className="profile-header">
          <div>
            <h1>Meu perfil</h1>
            <p>Gerencie suas informações pessoais e profissionais.</p>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h2>Informações pessoais</h2>
              <p>Atualize seus dados pessoais.</p>
            </div>
          </div>

          <div className="profile-divider" />

          <div className="profile-form-grid">
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

            <div className="profile-field">
              <label>Objetivo profissional</label>

              <div className="profile-textarea">
                <Target size={17} />

                <textarea placeholder="Descreva brevemente seus objetivos profissionais..." />
              </div>
            </div>
          </div>
        </section>

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