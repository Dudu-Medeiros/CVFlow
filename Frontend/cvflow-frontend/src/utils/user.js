import { getToken } from "./auth";

// Usuário Autenticado
async function getUser() {
    const token = getToken();

    if (!token) {
        return null;
    }

    const resposta = await fetch("http://127.0.0.1:5000/auth/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    return dados.usuario;
}

export { getUser };