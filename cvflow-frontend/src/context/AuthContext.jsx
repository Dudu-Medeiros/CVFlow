import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/user";
import { clearToken } from "../services/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let ativo = true;

        const verificarUsuario = async () => {
            try {
                const dadosUsuario = await getUser();
                if (ativo) setUsuario(dadosUsuario);
            } catch (erro) {
                console.error("Erro ao verificar sessão:", erro);
                if (ativo) setUsuario(null);
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        verificarUsuario();

        return () => {
            ativo = false;
        };
    }, []);

    const login = useCallback((dadosUsuario) => {
        setUsuario(dadosUsuario);
    }, []);

    const atualizarUsuario = useCallback((dadosAtualizados) => {
        setUsuario((prev) => ({ ...prev, ...dadosAtualizados }));
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUsuario(null);
        navigate("/auth", { replace: true });
    }, [navigate]);

    const autenticado = Boolean(usuario);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado,
                carregando,
                login,
                logout,
                atualizarUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};