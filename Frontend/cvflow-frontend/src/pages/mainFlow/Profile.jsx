import { useEffect, useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  Mail,
  Phone,
  Target,
  Save,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { usuario, atualizarUsuario } = useAuth();

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
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Sua sessão expirou. Faça login novamente."
        );
      }

      const resposta = await fetch(
        "http://127.0.0.1:5000/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeLimpo,
            email: emailLimpo,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível atualizar seu perfil."
        );
      }

      atualizarUsuario(dados.usuario);

      setNome(dados.usuario.nome);
      setEmail(dados.usuario.email);

      setMensagem(
        "Suas informações foram atualizadas com sucesso!"
      );
    } catch (erro) {
      setErro(
        erro.message ||
          "Ocorreu um erro ao salvar suas informações."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form
      className="profile-page"
      onSubmit={salvarAlteracoes}
    >
      <Sidebar />

      <section className="profile-content">
        <header className="profile-header">
          <div>
            <h1>Meu perfil</h1>
            <p>
              Gerencie suas informações pessoais e profissionais.
            </p>
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
              <label htmlFor="nome">Nome completo</label>

              <div className="profile-input">
                <UserRound size={17} />

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(evento) =>
                    setNome(evento.target.value)
                  }
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="email">E-mail</label>

              <div className="profile-input">
                <Mail size={17} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(evento) =>
                    setEmail(evento.target.value)
                  }
                  placeholder="Digite seu e-mail"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="telefone">Telefone</label>

              <div className="profile-input">
                <Phone size={17} />

                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(evento) =>
                    setTelefone(evento.target.value)
                  }
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
              <label htmlFor="cargo">
                Cargo ou área profissional
              </label>

              <div className="profile-input">
                <BriefcaseBusiness size={17} />

                <input
                  id="cargo"
                  type="text"
                  value={cargo}
                  onChange={(evento) =>
                    setCargo(evento.target.value)
                  }
                  placeholder="Ex: Desenvolvedor Front-End"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="objetivo">
                Objetivo profissional
              </label>

              <div className="profile-textarea">
                <Target size={17} />

                <textarea
                  id="objetivo"
                  value={objetivo}
                  onChange={(evento) =>
                    setObjetivo(evento.target.value)
                  }
                  placeholder="Descreva brevemente seus objetivos profissionais..."
                />
              </div>
            </div>
          </div>
        </section>

        <div className="profile-actions">
          {mensagem && (
            <div
              className="profile-notification success"
              role="status"
            >
              <CheckCircle size={20} />

              <div>
                <strong>Alterações salvas!</strong>
                <span>{mensagem}</span>
              </div>

              <button
                type="button"
                onClick={fecharMensagem}
                aria-label="Fechar mensagem"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {erro && (
            <div
              className="profile-notification error"
              role="alert"
            >
              <XCircle size={20} />

              <div>
                <strong>Não foi possível salvar</strong>
                <span>{erro}</span>
              </div>

              <button
                type="button"
                onClick={fecharMensagem}
                aria-label="Fechar mensagem"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <button
            type="submit"
            className="profile-save-button"
            disabled={salvando}
          >
            <Save size={17} />

            {salvando
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default Profile;