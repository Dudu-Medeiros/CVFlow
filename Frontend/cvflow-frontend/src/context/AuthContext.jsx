import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/user";

const AuthContext = createContext(null);

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

    const login = (dadosUsuario) => {
        setUsuario(dadosUsuario);
    };

    const atualizarUsuario = (dadosAtualizados) => {
        setUsuario(dadosAtualizados);
    };

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
                login,
                logout,
                atualizarUsuario,
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