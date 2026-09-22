import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    FileText,
    X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo-cvflow-sem-fundo.png";
import modeloAts from "../../assets/modeloAts.png";
import modeloModerno from "../../assets/modeloModerno.png";
import modeloExecutivo from "../../assets/modeloExecutivo.png";

import "./Modelos.css";

const modelos = [
    {
        id: "ats",
        nome: "ATS",
        descricao:
            "Estrutura objetiva e compatível com sistemas de recrutamento.",
        categoria: "Compatível com ATS",
        imagem: modeloAts,
    },
    {
        id: "moderno",
        nome: "Moderno",
        descricao:
            "Layout visual com duas colunas para destacar suas habilidades.",
        categoria: "Contemporâneo",
        imagem: modeloModerno,
    },
    {
        id: "executivo",
        nome: "Executivo",
        descricao:
            "Design elegante e organizado para uma apresentação profissional.",
        categoria: "Profissional",
        imagem: modeloExecutivo,
    },
];

function Modelos() {
    const navigate = useNavigate();
    const { autenticado, carregando } = useAuth();

    const [modeloVisualizado, setModeloVisualizado] = useState(null);

    const abrirVisualizacao = (modelo) => {
        setModeloVisualizado(modelo);
    };

    const fecharVisualizacao = () => {
        setModeloVisualizado(null);
    };

    const usarModelo = (modelo) => {
        localStorage.setItem("modeloSelecionado", modelo.id);

        if (autenticado) {
            navigate("/flow", {
                state: {
                    modeloSelecionado: modelo.id,
                },
            });

            return;
        }

        navigate("/auth", {
            state: {
                modeloSelecionado: modelo.id,
            },
        });
    };

    return (
        <main className="modelos-page">
            <header className="modelos-header">
                <Link to="/" className="modelos-logo">
                    <img src={logo} alt="Logo CVFlow" />
                </Link>

                <Link to="/" className="voltar-link">
                    <ArrowLeft size={17} />
                    Voltar
                </Link>
            </header>

            <section className="modelos-hero">
                <span className="modelos-badge">
                    <FileText size={16} />
                    Modelos de currículo
                </span>

                <h1>
                    Encontre o modelo ideal para sua carreira
                </h1>

                <p>
                    Escolha um modelo profissional e comece a criar um
                    currículo que destaque suas experiências e habilidades.
                </p>
            </section>

            <section className="modelos-lista">
                {modelos.map((modelo) => (
                    <article className="modelo-card" key={modelo.id}>
                        <div className="modelo-preview-container">
                            <span className="modelo-categoria">
                                {modelo.categoria}
                            </span>

                            <img
                                className="modelo-imagem"
                                src={modelo.imagem}
                                alt={`Prévia do modelo ${modelo.nome}`}
                            />
                        </div>

                        <div className="modelo-informacoes">
                            <h2>{modelo.nome}</h2>

                            <p>{modelo.descricao}</p>

                            <div className="modelo-acoes">
                                <button
                                    type="button"
                                    className="botao-visualizar"
                                    onClick={() =>
                                        abrirVisualizacao(modelo)
                                    }
                                >
                                    <Eye size={17} />
                                    Visualizar
                                </button>

                                <button
                                    type="button"
                                    className="botao-selecionar"
                                    onClick={() => usarModelo(modelo)}
                                    disabled={carregando}
                                >
                                    Usar modelo
                                    <ArrowRight size={17} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="modelos-beneficios">
                <div>
                    <Check size={18} />
                    Modelos profissionais
                </div>

                <div>
                    <Check size={18} />
                    Personalização fácil
                </div>

                <div>
                    <Check size={18} />
                    Exportação em PDF
                </div>
            </section>

            {modeloVisualizado && (
                <div
                    className="modal-overlay"
                    onClick={fecharVisualizacao}
                >
                    <div
                        className="modelo-modal"
                        onClick={(evento) =>
                            evento.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="modal-fechar"
                            onClick={fecharVisualizacao}
                            aria-label="Fechar visualização"
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-cabecalho">
                            <div>
                                <span className="modal-categoria">
                                    {modeloVisualizado.categoria}
                                </span>

                                <h2>{modeloVisualizado.nome}</h2>
                            </div>
                        </div>

                        <div className="modal-preview">
                            <img
                                src={modeloVisualizado.imagem}
                                alt={`Visualização ampliada do modelo ${modeloVisualizado.nome}`}
                            />
                        </div>

                        <div className="modal-informacoes">
                            <p>{modeloVisualizado.descricao}</p>

                            <button
                                type="button"
                                className="modal-usar-modelo"
                                onClick={() =>
                                    usarModelo(modeloVisualizado)
                                }
                                disabled={carregando}
                            >
                                Usar este modelo
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Modelos;