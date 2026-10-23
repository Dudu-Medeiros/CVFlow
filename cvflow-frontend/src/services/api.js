import { getToken, clearToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Se o token expirou ou é inválido, limpa os dados automaticamente
    if (response.status === 401) {
        clearToken();
        throw new Error("Sessão expirada ou não autorizada.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.erro || data.message || `Erro HTTP: ${response.status}`);
    }

    return data;
}