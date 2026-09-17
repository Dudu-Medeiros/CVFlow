import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/user";

// Criação do contexto
const AuthContext = createContext(null);

// Componente responsável por fornecer os dados
const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const verificarUsuario = async () => {
            try {
                const dadosUsuario = await getUser();

                setUsuario(dadosUsuario);
            } catch (erro) {
                console.error("Erro ao verificar usuário:", erro);
                setUsuario(null);
            } finally {
                setCarregando(false);
            }
        };

        verificarUsuario();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        setUsuario(null);

        navigate("/auth");
    };

    const autenticado = Boolean(usuario);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado,
                carregando,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };