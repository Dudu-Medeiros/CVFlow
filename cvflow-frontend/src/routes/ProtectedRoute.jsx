import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { autenticado, carregando } = useAuth();
    const location = useLocation();

    if (carregando) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                Verificando acesso...
            </div>
        );
    }

    if (!autenticado) {
        // Redireciona para /auth e guarda a página que ele tentou acessar
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <Outlet />;
}