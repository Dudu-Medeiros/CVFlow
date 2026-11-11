import { Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CORES_DISPONIVEIS = [
  { nome: "Ardósia", hex: "#1e293b" },
  { nome: "Marinho", hex: "#172033" },
  { nome: "Azul Royal", hex: "#2563eb" },
  { nome: "Esmeralda", hex: "#059669" },
  { nome: "Púrpura", hex: "#7c3aed" },
  { nome: "Bordô", hex: "#9f1239" },
];

export default function SeletorDeCores({ modelo, corAtual, onChangeCor }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const plano = usuario?.plano || "Starter";

  if (modelo === "ats" || modelo === "minimalista") {
    return null;
  }

  const corAtiva = corAtual || (modelo === "moderno" ? "#1e293b" : "#172033");
  const isStarter = plano === "Starter";

  return (
    <div className="item-dinamico" style={{ 
      marginTop: 0, 
      marginBottom: "32px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      flexWrap: "wrap", 
      gap: "16px" 
    }}>
      <div>
        <strong style={{ color: "#1e293b", fontSize: "14px", display: "block", marginBottom: "4px" }}>
          Paleta de Cores
        </strong>
        <span style={{ color: "#64748b", fontSize: "12px" }}>
          Personalize a cor principal do seu currículo
        </span>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Camada das Cores */}
        <div style={{
          display: "flex",
          gap: "10px",
          filter: isStarter ? "blur(4px)" : "none",
          opacity: isStarter ? 0.7 : 1,
          pointerEvents: isStarter ? "none" : "auto",
          padding: "4px" 
        }}>
          {CORES_DISPONIVEIS.map((cor) => {
            const isAtiva = corAtiva === cor.hex;
            return (
              <button
                key={cor.hex}
                type="button"
                onClick={() => onChangeCor(cor.hex)}
                title={cor.nome}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: cor.hex,
                  border: "2px solid #ffffff",
                  boxShadow: isAtiva ? `0 0 0 2px ${cor.hex}` : "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: isAtiva ? "scale(1.15)" : "scale(1)",
                  padding: 0
                }}
              />
            );
          })}
        </div>

        {/* Camada do Bloqueio PRO */}
        {isStarter && (
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <button
              type="button"
              onClick={() => navigate("/planos")}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <Lock size={14} /> Desbloquear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}